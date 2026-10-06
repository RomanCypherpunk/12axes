import { describe, expect, it } from 'vitest';
import { placeTooltip } from './tooltipPlacement';

const viewport = { width: 375, height: 800 };
const tip = { width: 200, height: 80 };

describe('placeTooltip', () => {
  it('centers the tooltip below the term when there is room', () => {
    const p = placeTooltip({ top: 100, bottom: 120, left: 140, width: 60 }, tip, viewport);

    expect(p.above).toBe(false);
    expect(p.top).toBe(130);
    expect(p.left).toBe(70);
    expect(p.arrowLeft).toBe(100);
  });

  it('flips above when it does not fit below', () => {
    const p = placeTooltip({ top: 700, bottom: 720, left: 140, width: 60 }, tip, viewport);

    expect(p.above).toBe(true);
    expect(p.top).toBe(610);
  });

  it('stays below when it fits neither way, rather than leaving the top of the screen', () => {
    const p = placeTooltip({ top: 40, bottom: 60, left: 140, width: 60 }, tip, { width: 375, height: 100 });

    expect(p.above).toBe(false);
  });

  it('keeps the tooltip inside the screen and the arrow on the term near the edges', () => {
    const nearLeft = placeTooltip({ top: 100, bottom: 120, left: 0, width: 30 }, tip, viewport);
    const nearRight = placeTooltip({ top: 100, bottom: 120, left: 350, width: 25 }, tip, viewport);

    expect(nearLeft.left).toBe(8);
    expect(nearLeft.arrowLeft).toBe(14);
    expect(nearRight.left).toBe(375 - 200 - 8);
    expect(nearRight.arrowLeft).toBe(186);
  });
});
