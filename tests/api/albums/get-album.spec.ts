import { test, expect } from '../../fixtures';

const REQUIRED_KEYS = [
  'id', 'name', 'album_type', 'artists', 'release_date', 'total_tracks', 'external_urls', 'href'
] as const;

test.describe('Albums – GET /albums/{id}', () => {
  test('returns album details for a valid album id', async ({ api }) => {
    const albumId = process.env.ALBUM_ID;
    expect(albumId, 'ALBUM_ID must be provided in .env').toBeTruthy();

    const res = await api.get(`/albums/${albumId}`);
    expect(res.status(), 'HTTP status').toBe(200);

    const json = await res.json();

    // Basic identity checks
    expect(json.id).toBe(albumId);
    expect(typeof json.name).toBe('string');
    expect(json.name.length).toBeGreaterThan(0);

    // Required shape
    for (const key of REQUIRED_KEYS) {
      expect(json, `missing key: ${key}`).toHaveProperty(key);
    }

    // Type/semantic checks
    expect(['album', 'single', 'compilation']).toContain(json.album_type);
    expect(Array.isArray(json.artists)).toBe(true);
    expect(json.artists.length).toBeGreaterThan(0);
    expect(typeof json.release_date).toBe('string');
    expect(Number.isInteger(json.total_tracks)).toBe(true);
    expect(json.total_tracks).toBeGreaterThan(0);
    expect(json.external_urls?.spotify).toMatch(/^https:\/\/open\.spotify\.com\/album\//);
    expect(json.href).toMatch(/^https:\/\/api\.spotify\.com\/v1\/albums\//);
  });
});
