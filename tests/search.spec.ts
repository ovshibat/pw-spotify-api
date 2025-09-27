import { test, expect } from './fixtures';

test('search tracks', async ({ api }) => {
  const res = await api.get('/search', { params: { q: 'Radiohead', type: 'track', limit: 5 } });
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.tracks.items.length).toBeGreaterThan(0);
});