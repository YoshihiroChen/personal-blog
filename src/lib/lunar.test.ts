import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lunarLocation, lunarBases, chamberPositions } from './lunar';
import { nodeById } from '../data/universe';
import { useUniverse } from '../stores/universe';

test('lunar navigation distinguishes the surface, bases and deeply nested stations', () => {
  assert.equal(lunarLocation('earth'), null);
  assert.equal(lunarLocation('knowledge')?.level, 0);
  assert.equal(lunarLocation('it')?.base?.id, 'it');
  assert.equal(lunarLocation('japanese')?.base?.id, 'languages');
  assert.deepEqual(lunarLocation('nextjs')?.trail.map(node => node.id), ['knowledge', 'it', 'frontend', 'react', 'nextjs']);
  for (const base of lunarBases) {
    assert.ok((nodeById[base.id].children?.length ?? 0) <= chamberPositions.length);
    assert.ok(Math.hypot(...base.position) > 3.8, 'Landing beacons sit above the lunar surface');
  }
});
test('returning through a lunar base preserves the knowledge world and reaches Earth correctly', () => {
  const snapshot = useUniverse.getState();
  try {
    useUniverse.getState().explore('nextjs');
    for (const id of ['react', 'frontend', 'it', 'knowledge']) {
      useUniverse.getState().back();
      assert.equal(useUniverse.getState().focusedId, id);
      assert.equal(useUniverse.getState().mode, 'knowledge');
    }
    useUniverse.getState().back();
    assert.equal(useUniverse.getState().focusedId, 'earth');
    assert.equal(useUniverse.getState().mode, 'earth');
  } finally { useUniverse.setState(snapshot, true); }
});
