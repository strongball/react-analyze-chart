import { distanceFromPoints, isBetween } from '../../core/utils/math';
import { Timestamp } from '../../types';
import { TimeSerie } from './TimeSerie';

export interface ScatterData {
  u: Timestamp;
  y: number;
}
export class ScatterSerie extends TimeSerie<ScatterData> {
  hitTest(coordX: number, coordY: number) {
    if (!this.xScale || !this.yScale) {
      return false;
    }
    // implement in pixel
    return this.dataInView.some((data) => {
      const currentPoint = {
        x: this.xScale!.convert(data.u),
        y: this.yScale!.convert(data.y),
      };
      const dis = distanceFromPoints({
        p1: currentPoint,
        p2: { x: coordX, y: coordY },
      });
      if (dis < 5) {
        return true;
      }
      return false;
    });
  }
  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const points = this.dataInView.map((v) => ({
      x: this.xScale!.convert(v.u),
      y: this.yScale!.convert(v.y),
    }));
    // console.log(points)
    const size = Math.min(this.xScale.gap, 4);
    points.forEach((p) => {
      this.painter.drawCircle({
        cx: p.x,
        cy: p.y,
        size: size,
        lineWidth: 1,
        strokeStyle: '#777777',
      });
    });
  }
  getRange(): [number, number] {
    const dataInView = this.getDataInView().map((d) => d.y);
    const max = Math.max(...dataInView);
    const min = Math.min(...dataInView);
    const paddingValue = (max - min) * 0.1;
    return [min - paddingValue, max + paddingValue];
  }
}
