/** HTML labels can be the event target; their offsetX/Y are not canvas coordinates. */
export function canvasPointer(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }) {
  return { x: (clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, y: 1 - (clientY - rect.top) / Math.max(1, rect.height) * 2 };
}
