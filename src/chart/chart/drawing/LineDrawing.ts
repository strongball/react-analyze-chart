import { distanceFromPoints, distanceFromPointToLine, isBetween } from '../../core/utils/math';
import { Drawing, Point } from './Drawing';

export class LineDrawing extends Drawing {
  move(diffX: number, diffY: number) {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const newData = this.data.map<Point>((d) => ({
      u: this.xScale!.calculateInRange(d.u, diffX),
      y: this.yScale!.calculateInRange(d.y, diffY),
    }));
    this.setData(newData);
  }
  setDataByKey(key: string, point: Point) {
    switch (key) {
      case 'start': {
        this.data[0] = point;
        break;
      }
      case 'end': {
        this.data[1] = point;
        break;
      }
    }
    this.setData(this.data);
  }
  public hitTest(x: number, y: number): boolean | string {
    if (!this.xScale! || !this.yScale) {
      return false;
    }
    const startCoordPoint = this.dataInView[0]
      ? {
          x: this.xScale.convert(this.dataInView[0].u),
          y: this.yScale.convert(this.dataInView[0].y),
        }
      : null;
    const endCoordPoint = this.dataInView[1]
      ? {
          x: this.xScale.convert(this.dataInView[1].u),
          y: this.yScale.convert(this.dataInView[1].y),
        }
      : null;
    if (this.isFocus && startCoordPoint) {
      const dis = distanceFromPoints({ p1: { x, y }, p2: startCoordPoint });
      if (dis < 5) {
        return 'start';
      }
    }
    if (this.isFocus && endCoordPoint) {
      const dis = distanceFromPoints({ p1: { x, y }, p2: endCoordPoint });
      if (dis < 5) {
        return 'end';
      }
    }
    if (startCoordPoint && endCoordPoint && isBetween({ a: startCoordPoint.x, b: endCoordPoint.x, target: x })) {
      const dis = distanceFromPointToLine({
        p1: startCoordPoint,
        p2: endCoordPoint,
        target: { x, y },
      });
      if (dis < 5) {
        return 'all';
      }
      return false;
    }
    return false;
  }
  protected render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const startCoordPoint = this.dataInView[0]
      ? {
          x: this.xScale!.convert(this.dataInView[0].u),
          y: this.yScale!.convert(this.dataInView[0].y),
        }
      : null;
    const endCoordPoint = this.dataInView[1]
      ? {
          x: this.xScale!.convert(this.dataInView[1].u),
          y: this.yScale!.convert(this.dataInView[1].y),
        }
      : null;
    if (startCoordPoint && endCoordPoint) {
      this.painter.drawLine({
        points: [startCoordPoint, endCoordPoint],
        color: '#ff00ff',
        width: 4,
      });
    }

    if (this.isFocus) {
      [startCoordPoint, endCoordPoint].forEach((p) => {
        p &&
          this.painter.drawCircle({
            cx: p.x,
            cy: p.y,
            size: 6,
            lineWidth: 2,
            fillStyle: '#ffffff',
            strokeStyle: '#777777',
          });
      });
    }
  }
}
