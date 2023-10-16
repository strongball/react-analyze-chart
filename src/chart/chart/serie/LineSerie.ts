import { distanceFromPointToLine, isBetween } from '../../core/utils/math';
import { Timestamp } from '../../types';
import { TimeSerie } from './TimeSerie';

export interface LineData {
  u: Timestamp;
  y: number;
}
export interface LineConfig {
  color: string;
  width: number;
}
export class LineSerie extends TimeSerie<LineData> {
  config: LineConfig = {
    color: '#0000ff',
    width: 1,
  };
  constructor(config?: Partial<LineConfig>) {
    super();
    Object.assign(this.config, config);
  }
  hitTest(coordX: number, coordY: number) {
    if (!this.xScale || !this.yScale) {
      return false;
    }
    // implement in pixel
    return this.dataInView.some((data, index) => {
      if (index === 0) {
        return false;
      }
      const prev = this.dataInView[index - 1];
      const prevPoint = {
        x: this.xScale!.convert(prev.u),
        y: this.yScale!.convert(prev.y),
      };
      const currentPoint = {
        x: this.xScale!.convert(data.u),
        y: this.yScale!.convert(data.y),
      };
      if (isBetween({ a: prevPoint.x, b: currentPoint.x, target: coordX })) {
        const dis = distanceFromPointToLine({
          p1: prevPoint,
          p2: currentPoint,
          target: { x: coordX, y: coordY },
        });
        if (dis < 5) {
          return true;
        }
      }
      return false;
    });
  }
  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const { xScale, yScale } = this;

    const points = this.dataInView
      .filter((v) => v.y !== null)
      .map((v) => ({
        x: xScale.convert(v.u),
        y: yScale.convert(v.y),
      }));
    this.painter.drawLine({
      points,
      color: this.config.color,
      width: this.config.width,
    });
  }

  getRange(): [number, number] | null {
    const dataInView = this.getDataInView()
      .map((d) => d.y)
      .filter((d) => d !== null);
    if (dataInView.length === 0) {
      return null;
    }
    const max = Math.max(...dataInView);
    const min = Math.min(...dataInView);
    const paddingValue = (max - min) * 0.1;
    return [min - paddingValue, max + paddingValue];
  }
}
