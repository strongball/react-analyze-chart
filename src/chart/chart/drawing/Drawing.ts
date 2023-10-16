import { CoordPoint } from '../../core/painter/interface';
import { NumericalType, Timestamp } from '../../types';
import { TimeSerie } from '../serie/TimeSerie';

export interface Point {
  u: Timestamp;
  y: number;
}
export abstract class Drawing extends TimeSerie<Point> {
  isFocus = false;

  setFocus(f: boolean) {
    if (this.isFocus === f) {
      return;
    }
    this.isFocus = f;
    this.updateLayer();
  }
  abstract setDataByKey(key: string, point: Point);
  abstract move(x: number, v: number);
  setDataByKeyAndCoord(key: string, point: CoordPoint) {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const u = this.xScale.invert(point.x);
    const y = this.yScale.invert(point.y);
    this.setDataByKey(key, { u, y });
  }

  getRange() {
    return null;
  }
  getDataInViewKey(): string {
    if (!this.yScale) {
      return '';
    }
    return `${this.yScale.mode}`;
  }
}
