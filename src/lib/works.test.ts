import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fleetShips, isFleetShipId, workProjects } from '../data/works';
import { useUniverse } from '../stores/universe';

test('the first works fleet has exactly one flagship and two distinct project vessels', () => {
  assert.deepEqual(fleetShips.map(ship=>ship.id), ['flagship','research','communications']);
  assert.equal(new Set(fleetShips.map(ship=>ship.code)).size,3);
  assert.equal(isFleetShipId('communications'),true);
  assert.equal(isFleetShipId('unknown'),false);
  assert.ok(workProjects.research.category.includes('IT'));
  assert.ok(workProjects.communications.category.includes('LANGUAGE'));
});
test('selecting works clears other content and returning home clears vessel selection', () => {
  const snapshot=useUniverse.getState();
  try {
    useUniverse.getState().explore('japanese');
    useUniverse.getState().patch({activeStoryId:'japanese'});
    useUniverse.getState().openWork('research');
    assert.equal(useUniverse.getState().focusedId,'works');
    assert.equal(useUniverse.getState().mode,'works');
    assert.equal(useUniverse.getState().selectedWorkId,'research');
    assert.equal(useUniverse.getState().selectedId,null);
    assert.equal(useUniverse.getState().activeStoryId,null);
    useUniverse.getState().navigate('works');
    assert.equal(useUniverse.getState().selectedWorkId,'flagship');
    useUniverse.getState().back();
    assert.equal(useUniverse.getState().mode,'overview');
    assert.equal(useUniverse.getState().selectedWorkId,null);
    useUniverse.getState().explore('works');
    assert.equal(useUniverse.getState().selectedWorkId,'flagship');
    useUniverse.getState().navigate('knowledge');
    assert.equal(useUniverse.getState().selectedWorkId,null);
  } finally { useUniverse.setState(snapshot,true); }
});
