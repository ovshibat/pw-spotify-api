import { test, expect } from '../../fixtures';

const REQUIRED_KEYS = [
  'id', 'name', 'album_type', 'artists', 'release_date', 'total_tracks', 'external_urls', 'href'
] as const;

const invalidAlbumIds = [
  '',                                   // empty
  'abc123',                             // too short
  '12345678901234567890123',            // too long (23 chars)
  'abc$%^&*',                           // illegal characters
  'https://open.spotify.com/album/1ATL5GLyefJaxhQzSPVrLX', // full URL
  '1ATL5GLyefJaxhQzSPVrLX ',            // valid ID but with whitespace
];

type InvalidAlbumCase = {
  id: string;
  label: string;
  expectedStatus: number;
  expectedMessage: String | RegExp;
}

const invalidAlbumCases: InvalidAlbumCase[] = [
  {
    label: 'empty string',
    id: '',
    expectedStatus: 400,
    expectedMessage: /Missing required field: ids/i,
  },
  // Add the rest of your scenarios here with their own status/message pairs.
  {
    label: 'too short',
    id: 'abc123',
    expectedStatus: 400,
    expectedMessage: /Invalid base62 id/i,
  },
  {
    label: 'too long',
    id: '12345678901234567890123',
    expectedStatus: 400,
    expectedMessage: /Invalid base62 id/i,
  },
  {
    label: 'illegal characters',
    id: 'abc%24%25%5E%26*',
    expectedStatus: 400,
    expectedMessage: /Invalid base62 id/i,
  },
  {
    label: 'full URL',
    id: 'https%3A%2F%2Fopen.spotify.com%2Falbum%2F1ATL5GLyefJaxhQzSPVrLX',
    expectedStatus: 400,
    expectedMessage: /Invalid base62 id/i,
  },
  {
    label: 'valid ID but with whitespace',
    id: '21jF5jtzo94wbxmJ18aa ',
    expectedStatus: 400,
    expectedMessage: /Invalid base62 id/i,
  }
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

  test.describe('invalid inputs', () => {
    for (const { label, id, expectedStatus, expectedMessage } of invalidAlbumCases) {
      test(`returns ${expectedStatus} when album id is ${label}`, async ({ api }) => {
        const res = await api.get(`albums/${id}`);
        expect(res.status(), 'HTTP status').toBe(expectedStatus);

        const body = await res.json();
        expect(body).toHaveProperty('error');
        expect(body.error.status, 'error.status').toBe(expectedStatus);

        if (typeof expectedMessage === 'string') {
          expect(body.error.message, 'error.message').toBe(expectedMessage);
        } else {
          expect(body.error.message, 'error.message').toMatch(expectedMessage);
        }
      });
    }
  });

});
