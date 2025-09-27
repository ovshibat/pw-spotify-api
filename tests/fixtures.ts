import { test as base } from '@playwright/test';
import { getClientCredentialsToken } from '../src/spotifyAuth';
import { refreshWithPKCE } from '../src/spotifyPkce';

// Define custom fixture type that provides authenticated API context
type ApiFixtures = {
  api: import('@playwright/test').APIRequestContext;
};

// Extend Playwright's base test with custom API fixture
export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    // Get authentication credentials from environment variables
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
    
    let token: string;
    
    // Choose authentication method based on available credentials
    if (SPOTIFY_REFRESH_TOKEN) {
      // Use PKCE refresh if refresh token is available (user auth)
      token = await refreshWithPKCE(SPOTIFY_CLIENT_ID!, SPOTIFY_REFRESH_TOKEN);
    } else {
      // Fall back to client credentials (app-only auth)
      token = await getClientCredentialsToken(SPOTIFY_CLIENT_ID!, SPOTIFY_CLIENT_SECRET!);
    }
    
    // Create authenticated API request context using playwright.request
    const api = await playwright.request.newContext({
      baseURL: 'https://api.spotify.com/v1',  // Set Spotify API base URL
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },  // Add auth header
    });
    
    // Provide the authenticated API context to the test
    await use(api);
    
    // Clean up resources after test completes
    await api.dispose();
  },
});

// Re-export Playwright's expect for convenience
export const expect = base.expect;
