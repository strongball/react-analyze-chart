import { Timestamp } from '../../types';
import { Scale } from './Scale';

const MIN_EDGE = 2;
export const linear =
  ([d0, d1], [r0, r1]) =>
  (x) =>
    r0 + ((x - d0) * (r1 - r0)) / (d1 - d0);
export class TimeScale extends Scale<number> {
  range: [number, number] = [0, 0];
  domain: [number, number] = [0, 0];
  offset: number = 0;
  ticks: Timestamp[] = [];
  ticksCache: Map<Timestamp, number> = new Map();
  gap: number = 20;

  get capacity(): number {
    const w = this.domain[1] - this.domain[0];
    return w / this.gap;
  }
  get rangeTimestamp() {
    const leftIdx = Math.max(0, Math.floor(this.range[0] + 1));
    const rightIdx = Math.min(this.ticks.length - 1, Math.ceil(this.range[1]));
    return [this.ticks[leftIdx], this.ticks[rightIdx]];
  }

  get pivot() {
    const rightIdx = Math.min(this.ticks.length - 1, Math.ceil(this.range[1]));
    return this.ticks[rightIdx];
  }

  public override setDomain(domain: [number, number]) {
    this.domain = domain;
    this.setRange([this.range[1] - this.capacity, this.range[1]]);
  }

  convert(v: Timestamp) {
    const nearestIndex = this.findNearestIndex(v);
    return linear(this.range, this.domain)(nearestIndex) - this.gap / 2;
  }
  invert(p: number): Timestamp {
    const timestampIdx = Math.round(linear(this.domain, this.range)(p + this.gap / 2));
    return this.ticks[timestampIdx];
  }

  findNearestIndex(v: Timestamp) {
    return this.ticksCache.get(v)!;
  }

  calculateInRange(base: Timestamp, changeIndex: number): Timestamp {
    const idx = this.findNearestIndex(base);
    return this.ticks[idx + changeIndex];
  }
  setTicks(ticks: Timestamp[]) {
    this.ticks = ticks;
    this.ticksCache = new Map();
    this.ticks.forEach((tick, idx) => {
      this.ticksCache.set(tick, idx);
    });
  }
  setPivot(time: Timestamp) {
    if (this.pivot === time) {
      return;
    }
    const rightIdx = this.findNearestIndex(time);
    this.setRange([rightIdx - this.capacity, rightIdx]);
  }

  setGap(gap: number) {
    if (this.gap === gap) {
      return;
    }
    const boundedGap = Math.max(1, Math.min(this.domain[1] / 2, gap));
    this.gap = boundedGap;
    const rightIdx = this.range[1];
    this.setRange([rightIdx - this.capacity, rightIdx]);
  }
  move(offset: number) {
    const offsetByGap = Math.round((offset / this.gap) * 100) / 100;
    const left = this.range[0] + offsetByGap;
    const right = this.range[1] + offsetByGap;
    this.setRange(this.fixLeftRight(left, right));
  }
  zooming(rate: number, keepPosition?: Timestamp) {
    if (!keepPosition) {
      this.setGap(this.gap * (1 + rate));
      return;
    }
    /**
     *   ----x-----  C
     *    L     R
     */
    const newGap = this.gap * (1 + rate);
    const keepIdx = this.findNearestIndex(keepPosition);
    const oldCapacity = this.capacity;
    const boundedGap = Math.max(1, Math.min(this.domain[1] / 2, newGap));
    this.gap = boundedGap;
    const capacityChange = this.capacity - oldCapacity;

    const left = keepIdx - this.range[0];
    const right = this.range[1] - keepIdx;
    const newRangeRight = this.range[1] + capacityChange * (right / (left + right));
    const newRangeLeft = newRangeRight - this.capacity;
    this.setRange(this.fixLeftRight(newRangeLeft, newRangeRight));
  }
  private fixLeftRight(left: number, right: number): [number, number] {
    // eslint-disable-next-line no-underscore-dangle
    let _left = left;
    // eslint-disable-next-line no-underscore-dangle
    let _right = right;
    if (left >= this.ticks.length - 1 - MIN_EDGE) {
      _left = this.ticks.length - 1 - MIN_EDGE;
      _right = _left + this.capacity;
    }
    if (right < MIN_EDGE) {
      _right = MIN_EDGE - 1;
      _left = _right - this.capacity;
    }
    return [_left, _right];
  }
}
