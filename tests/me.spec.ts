import { test, expect } from './fixtures';

test('get current user profile', async ({ api }) => {
  const res = await api.get('me');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('id');
  expect(json).toHaveProperty('email'); // if scope granted
});
