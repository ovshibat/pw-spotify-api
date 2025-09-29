import { test, expect } from '../../fixtures';

const REQUIRED_KEYS = [
  'id', 'name', 'album_type', 'artists', 'release_date', 'total_tracks', 'external_urls', 'href'
] as const;

const invalidAlbumIds = [
  '',                                   // empty
  'abc123',                             // too short
  '12345678901234567890123',            // too long (23 chars)
  'abc$%^&*',                           // illegal characters
  ' https://open.spotify.com/album/1ATL5GLyefJaxhQzSPVrLX', // full URL
  '1ATL5GLyefJaxhQzSPVrLX ',            // valid ID but with whitespace
];

test.describe('Albums – GET /albums/{id}', () => {
test('returns album details for a valid album id', async ({ api }) => {
    const albumId = process.env.ALBUM_ID;
    expect(albumId, 'ALBUM_ID must be provided in .env').toBeTruthy();

    const res = await api.get(`albums/${albumId}`);
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

  test.describe('Albums – GET /albums/{id} – Invalid ID Format (400)', () => {
  for (const badId of invalidAlbumIds) {
    test(`returns 400 for invalid album id: "${badId}"`, async ({ api }) => {
      const res = await api.get(`albums/${badId}`);
      expect(res.status(), `Expected 400 for id: ${badId}`).toBe(400);

      
      const json = await res.json();
      expect(json).toHaveProperty('error');
      expect(json.error.status).toBe(400);
      expect(typeof json.error.message).toBe('string');
      expect(json.error.message.toLowerCase()).toContain('missing required field: ids');
    });
  }
});
});
