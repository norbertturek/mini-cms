import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

describe('workspace bootstrap', () => {
  it('contains the planned frontend and backend apps', () => {
    assert.equal(existsSync('apps/backend/package.json'), true);
    assert.equal(existsSync('apps/frontend/package.json'), true);
  });

  it('keeps the repository wired as a pnpm workspace', () => {
    const workspace = readFileSync('pnpm-workspace.yaml', 'utf8');

    assert.match(workspace, /apps\/\*/);
    assert.match(workspace, /packages\/\*/);
  });
});
