import { NumericalType } from '../../types';
import { Scale } from './Scale';

export const linear =
  ([d0, d1], [r0, r1]) =>
  (x) =>
    r0 + ((x - d0) * (r1 - r0)) / (d1 - d0);
export class LinearScale extends Scale<number> {
  private _mode: NumericalType = 'Linear';
  range: [number, number] = [0, 0];
  domain = <[number, number]>[0, 0];
  private _percentBase: number = 0;

  get mode() {
    return this._mode;
  }
  set mode(m: NumericalType) {
    if (this.mode === m) {
      return;
    }
    this._mode = m;
    this.triggerScaleListener();
  }

  get percentBase(): number {
    if (this._percentBase === undefined) {
      throw new Error("percentBase can't be undefined");
    }
    return this._percentBase;
  }

  set percentBase(p: number) {
    if (this._percentBase === p) {
      return;
    }
    this._percentBase = p;
    if (this.mode === 'Percentage') {
      this.triggerScaleListener();
    }
  }
  move(changePixel: number) {
    const newRange: [number, number] = [
      this.invert(this.domain[0] + changePixel),
      this.invert(this.domain[1] + changePixel),
    ];
    if (this.mode === 'Percentage') {
      newRange[0] = newRange[0] / this.percentBase - 1;
      newRange[1] = newRange[1] / this.percentBase - 1;
    }
    this.setRange(newRange);
  }
  calculateInRange(base: number, changePixel: number): number {
    return this.invert(this.convert(base) + changePixel);
  }

  convert(v: number): number {
    switch (this.mode) {
      case 'Log': {
        return linear([Math.log(this.range[0]), Math.log(this.range[1])], this.domainInRange)(Math.log(v));
      }
      case 'Percentage':
        return linear(this.range, this.domainInRange)(v / this.percentBase - 1);
      case 'Linear':
      default: {
        return linear(this.range, this.domainInRange)(v);
      }
    }
  }
  invert(p: number): number {
    switch (this.mode) {
      case 'Log': {
        return Math.exp(linear(this.domainInRange, [Math.log(this.range[0]), Math.log(this.range[1])])(p));
      }
      case 'Percentage':
        return this.percentBase * (1 + linear(this.domainInRange, this.range)(p));
      case 'Linear':
      default: {
        return linear(this.domainInRange, this.range)(p);
      }
    }
  }
}
