import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canvasPointer } from './pointer';
test('canvas picking uses client coordinates even when the event target is an HTML label', () => {
  const rect = { left: 120, top: 80, width: 800, height: 600 };
  assert.deepEqual(canvasPointer(520, 380, rect), { x: 0, y: 0 });
  assert.deepEqual(canvasPointer(120, 80, rect), { x: -1, y: 1 });
  assert.deepEqual(canvasPointer(920, 680, rect), { x: 1, y: -1 });
});
