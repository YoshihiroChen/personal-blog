import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryCameraPositions, ENTRY_PAUSE_SECONDS, ENTRY_FLIGHT_SECONDS } from './entry';
import { useUniverse } from '../stores/universe';
import { solarBodies } from '../data/solar-system';
import { positionOnEllipse } from './orbits';
import { planetIds, planetHref } from './planets';
import { nodeById } from '../data/universe';
test('closer entrance keeps the orbits through Jupiter visible on portrait and desktop', () => {
  for (const aspect of [1440 / 1000, 390 / 844]) {
    const views = entryCameraPositions(aspect);
    assert.ok(views.closeDistance < views.wideDistance);
    assert.ok(views.closeDistance > 0);
    assert.ok(Math.abs(Math.hypot(views.wide.y, views.wide.z) - views.wideDistance) < 1e-8);
    const elevation = 35 * Math.PI / 180, tangent = Math.tan(21 * Math.PI / 180);
    for (const body of solarBodies.slice(0, 5)) for (let i = 0; i < 64; i++) {
      const [x, y, z] = positionOnEllipse(body.orbit, i / 64 * Math.PI * 2);
      const depth = views.closeDistance - y * Math.sin(elevation) - z * Math.cos(elevation);
      assert.ok(depth > 0);
      assert.ok(Math.abs(x / depth) < tangent * aspect);
      assert.ok(Math.abs((y * Math.cos(elevation) - z * Math.sin(elevation)) / depth) < tangent);
    }
  }
  assert.equal(ENTRY_PAUSE_SECONDS, 0);
  assert.ok(ENTRY_FLIGHT_SECONDS > 0);
});
test('manual visibility and celestial navigation complete the entrance without resetting it', () => {
  const snapshot = useUniverse.getState();
  try {
    useUniverse.setState({ introComplete: false, interfaceVisible: false });
    useUniverse.getState().toggleInterface();
    assert.equal(useUniverse.getState().introComplete, true);
    assert.equal(useUniverse.getState().interfaceVisible, true);
    useUniverse.getState().toggleInterface();
    assert.equal(useUniverse.getState().interfaceVisible, false);
    assert.equal(useUniverse.getState().introComplete, true);
    useUniverse.getState().explore('earth');
    assert.equal(useUniverse.getState().interfaceVisible, true);
    useUniverse.getState().navigate('overview');
    assert.equal(useUniverse.getState().introComplete, true);
  } finally { useUniverse.setState(snapshot, true); }
});
test('start exploration stays in the solar system at half the previous camera distance', () => {
  const snapshot = useUniverse.getState();
  try {
    useUniverse.getState().beginExploration();
    assert.equal(useUniverse.getState().focusedId, 'universe');
    assert.equal(useUniverse.getState().mode, 'overview');
    assert.equal(useUniverse.getState().solarExploring, true);
    assert.equal(useUniverse.getState().introComplete, true);
    for (const aspect of [1440 / 1000, 390 / 844]) {
      const views = entryCameraPositions(aspect);
      assert.equal(views.exploreDistance, views.closeDistance * .5);
      assert.ok(Math.abs(Math.hypot(views.explore.y, views.explore.z) - views.exploreDistance) < 1e-8);
    }
    useUniverse.getState().navigate('overview');
    assert.equal(useUniverse.getState().solarExploring, false);
  } finally { useUniverse.setState(snapshot, true); }
});
test('every solar body including the Sun and Moon has a distinct page', () => {
  assert.equal(planetIds.length, 11);
  assert.equal(new Set(planetIds.map(planetHref)).size, 11);
  for (const id of planetIds) assert.ok(nodeById[id]);
  assert.ok(planetIds.includes('sun') && planetIds.includes('knowledge'));
});
