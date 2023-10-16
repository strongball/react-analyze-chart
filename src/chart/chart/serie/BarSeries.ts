import { Timestamp } from '../../types';
import { SerieOptions } from './Serie';
import { TimeSerie, TimeSeriesOptions } from './TimeSerie';

export interface BarData {
  u: Timestamp;
  v: number;
}
export interface BarStyle {
  color: string;
  width: number;
}
export interface BarConfig extends TimeSeriesOptions<BarData> {
  style?: BarStyle;
}
export class BarSeries extends TimeSerie<BarData> {
  style: BarStyle = {
    color: '#0000ff',
    width: 1,
  };
  constructor({ style, ...restProps }: BarConfig = {}) {
    super(restProps);
    Object.assign(this.style, style);
  }
  hitTest(coordX: number, coordY: number) {
    if (!this.xScale || !this.yScale) {
      return false;
    }
    // implement in data
    const x = this.xScale!.invert(coordX) ?? null;
    const y = this.yScale!.invert(coordY) ?? null;
    const hitColumns =
      x !== null &&
      y !== null &&
      this.data.some((d) => {
        if (d.u !== x) {
          return false;
        }
        return y <= d.v;
      });
    if (hitColumns) {
      return true;
    }
    return false;
  }
  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const gap = this.xScale.gap;
    const bottom = this.yScale!.domain[1];
    // bw = gap - 2 * p
    const padding = gap >= 3 ? 1 : Math.max(gap - 1, 0) / 2;
    const points = this.dataInView
      .filter((d) => d.v !== null)
      .map((d) => ({
        x: this.xScale!.convert(d.u),
        y: this.yScale!.convert(d.v),
      }));

    points.forEach((p) => {
      this.painter.drawRect({
        x: p.x - gap / 2,
        y: p.y,
        w: gap,
        h: bottom - p.y,
        color: 'rgba(12, 155, 55, 0.4)',
        padding: [0, padding],
      });
    });
  }

  getRange(): [number, number] | null {
    const dataInView = this.getDataInView()
      .map((d) => d.v)
      .filter((d) => d !== null);
    if (dataInView.length === 0) {
      return null;
    }
    const max = Math.max(...dataInView);
    return [0, max];
  }
}
