import { CoordPoint } from '../../core/painter/interface';
import { pointInArea } from '../../core/utils/math';
import { Point, Timestamp } from '../../types';
import { TimeSerie } from './TimeSerie';

export interface BandData {
  u: Timestamp;
  h: number;
  l: number;
}

export class BandSeries extends TimeSerie<BandData> {
  pointCache: Point[] = [];
  pointLines: [Point, Point][] | undefined;
  private createCacheLine(): [Point, Point][] {
    const pointLines: [Point, Point][] = [];
    if (this.pointCache.length < 2) {
      return [];
    }
    this.pointCache.forEach((p, index) => {
      if (index === 0) {
        pointLines.push([this.pointCache[this.pointCache.length - 1], this.pointCache[index]]);
      } else {
        pointLines.push([this.pointCache[index - 1], this.pointCache[index]]);
      }
    });
    return pointLines;
  }
  hitTest(coordX: number, coordY: number) {
    if (this.pointCache.length < 2) {
      return false;
    }
    if (!this.pointLines) {
      this.pointLines = this.createCacheLine();
    }
    const inside = pointInArea({ x: coordX, y: coordY }, this.pointLines);
    return inside;
  }
  render() {
    this.pointCache = [];
    this.pointLines = undefined;
    if (!this.xScale || !this.yScale) {
      return;
    }
    const areaPoints = this.dataInView.map((d) => ({
      x: this.xScale!.convert(d.u),
      h: this.yScale!.convert(d.h),
      l: this.yScale!.convert(d.l),
    }));
    const topPoints = areaPoints.map<CoordPoint>((p) => ({
      x: p.x,
      y: p.h,
    }));
    const downPoints = areaPoints
      .map<CoordPoint>((p) => ({
        x: p.x,
        y: p.l,
      }))
      .reverse();
    this.pointCache = [...topPoints, ...downPoints];
    this.painter.drawArea({
      points: this.pointCache,
      fillStyle: 'rgba(0, 186, 52, 0.16)',
    });
  }
  getRange(): [number, number] {
    const dataInView = this.getDataInView()
      .map((d) => [d.h, d.l])
      .flat();
    const max = Math.max(...dataInView);
    const min = Math.min(...dataInView);
    const paddingValue = (max - min) * 0.1;
    return [min - paddingValue, max + paddingValue];
  }
}
