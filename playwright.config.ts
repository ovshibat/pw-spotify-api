import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the project's root .env file into process.env.
dotenv.config();

export default defineConfig({
  // Directory where Playwright will look for all test files.
  testDir: './tests',

  // Maximum time (in ms) a single test is allowed to run (30 seconds).
  timeout: 30_000,

  // Defines how test results are displayed.
  reporter: [
    // 1. HTML Reporter: Generates a browsable report but doesn't auto-open the browser.
    ['html', { open: 'never' }],
    // 2. List Reporter: Shows simple pass/fail list in the terminal.
    ['list']
  ],

  // Default settings applied to all test contexts.
  use: {
    // Base URL for all page navigations (allows for relative path usage like page.goto('/login')).
    baseURL: 'https://api.spotify.com/v1',
  },
});