import { test, expect } from '../../fixtures';

test.describe("Get album tracks - GET /album/{id}/tracks", () => {
  test('returns track list for a valid album id', async ({ api }) => {
    const albumId = process.env.ALBUM_ID;
    expect(albumId, "ALBUM_ID is provided in .env").toBeTruthy();

    const res = await api.get(`albums/${albumId}/tracks`);
    expect(res.status(), 'HTTP status').toBe(200);
    
  });
});

test.describe('Albums – GET /albums/{id}/tracks', () => {
  test('returns track list for a valid album id', async ({ api }) => {
    const albumId = process.env.ALBUM_ID;
    expect(albumId, 'ALBUM_ID must be provided in .env').toBeTruthy();

    const res = await api.get(`albums/${albumId}/tracks`);
    expect(res.status(), 'HTTP status').toBe(200);

    const json = await res.json();

    // Verify response structure
    expect(json).toHaveProperty('items');
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeGreaterThan(0);

    // Verify first track has required properties
    const firstTrack = json.items[0];
    expect(firstTrack).toHaveProperty('id');
    expect(firstTrack).toHaveProperty('name');
    expect(firstTrack).toHaveProperty('track_number');
    expect(firstTrack).toHaveProperty('duration_ms');
    expect(firstTrack).toHaveProperty('artists');

    // Type checks
    expect(typeof firstTrack.name).toBe('string');
    expect(Number.isInteger(firstTrack.track_number)).toBe(true);
    expect(Number.isInteger(firstTrack.duration_ms)).toBe(true);
    expect(Array.isArray(firstTrack.artists)).toBe(true);
  });
});
