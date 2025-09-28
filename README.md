# Spotify API Testing with Playwright

This project is a **Playwright + TypeScript** test suite for automating and validating Spotify's Web API.  
It demonstrates how to set up API tests with proper authentication, fixtures, and reusable client helpers.

---

## Features
- Playwright test runner with TypeScript.
- Supports **Spotify Client Credentials** (read-only API calls).
- Supports **Authorization Code with PKCE** (user-level endpoints, e.g., playlists, profile).
- Shared **APIRequestContext fixture** that auto-injects `Authorization: Bearer <token>`.
- Example tests:
  - Search for tracks.
  - Fetch current user profile.
  - Create and manage playlists (with cleanup).
- Organized project structure with `src/` (auth, client) and `tests/`.

---

## Setup

### 1. Clone & install
```bash
git clone <repo-url>
cd pw-spotify-api
npm install
```

### 2. Configure environment
Create a `.env` file:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret   # required for client credentials flow
SPOTIFY_REFRESH_TOKEN=your_refresh_token   # required for user-level endpoints
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

> ⚠️ Do not commit `.env` — it’s ignored in `.gitignore`.

### 3. Run tests
```bash
npx playwright test
```

---

## Project Structure
```
src/
  spotifyAuth.ts       # Client Credentials flow
  spotifyPkce.ts       # PKCE refresh helper
  spotifyClient.ts     # Thin wrapper around API endpoints
tests/
  fixtures.ts          # APIRequestContext fixture
  search.spec.ts       # Example: search tracks
  me.spec.ts           # Example: current user profile
  playlist.spec.ts     # Example: playlist CRUD
playwright.config.ts
.env
```

---

## Notes
- By default, tests are read-only. Playlist modification tests **create → verify → cleanup**.
- Rate limits are handled via retry helpers (recommended if scaling).
- For CI, store secrets as GitHub Actions repository secrets.

---

## Resources
- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Playwright Test Runner](https://playwright.dev/docs/test-intro)
