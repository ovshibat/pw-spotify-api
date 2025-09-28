import { test, expect } from './fixtures';

test.describe('current user profile', () => {
  test.skip(!process.env.SPOTIFY_REFRESH_TOKEN, 'SPOTIFY_REFRESH_TOKEN env var required for /me endpoint');

  test('get current user profile', async ({ api }) => {
    const res = await api.get('me');
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('email'); // if scope granted
  });
});
