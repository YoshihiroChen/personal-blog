import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fleetShips, solarFleetShips, isFleetShipId, workProjects } from '../data/works';
import { useUniverse } from '../stores/universe';

test('all eight projects have vessels while the solar icon keeps the original three', () => {
  assert.equal(fleetShips.length,9);
  assert.deepEqual(solarFleetShips.map(ship=>ship.id),['flagship','research','communications']);
  assert.equal(new Set(fleetShips.map(ship=>ship.code)).size,9);
  assert.equal(Object.keys(workProjects).length,8);
  assert.equal(fleetShips.filter(ship=>ship.id!=='flagship'&&workProjects[ship.id].category==='IT PROJECT').length,7);
  assert.equal(workProjects['booking-system'].status,'SERVICE PAUSED · HOSTING COSTS');
  for(const ship of fleetShips)if(ship.id!=='flagship')assert.equal(ship.name,workProjects[ship.id].title);
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
