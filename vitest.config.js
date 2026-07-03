import { defineConfig } from 'vitest/config';

// Beperk test-discovery tot het project zelf. Zonder deze exclude globt vitest
// ook .claude/worktrees/** mee — git-worktrees van andere (Claude-)sessies met
// eigen, mogelijk rode tests — waardoor `npm test` en preflight vals falen.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.js', 'src/**/*.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**', '.claude/**'],
  },
});
