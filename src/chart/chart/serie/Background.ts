import { filterxAxisByWeight } from '../../core/utils/XAxisDateTick';
import { TimeSerie } from './TimeSerie';
import { sliceDataInView } from './utils';
import { XAxisData } from './XAxis';

export class Background extends TimeSerie<XAxisData> {
  hitTest(coordX: number, coordY: number) {
    return false;
  }
  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const [d1, d2] = this.yScale.domain;
    this.dataInView.forEach((d) => {
      const coordX = this.xScale!.convert(d.u);
      this.painter.drawLine({
        points: [
          { x: coordX, y: d1 },
          { x: coordX, y: d2 },
        ],
        color: 'rgba(0,0,0,.1)',
        width: 1,
      });
    });
  }
  protected transformPercentValue(data: XAxisData[]): XAxisData[] {
    return data;
  }
  getRange() {
    return null;
  }
  getDataInViewKey(): string {
    if (!this.xScale || !this.yScale) {
      return '';
    }
    return `${this.xScale.range[0]}-${this.xScale.range[1]}-${this.xScale.capacity}`;
  }
  getDataInView(): XAxisData[] {
    if (!this.xScale) {
      return [];
    }
    const [start, end] = this.xScale!.rangeTimestamp;
    const intervalLine = 82 / this.xScale.gap;
    const data = sliceDataInView(this.data, {
      start,
      end,
    });
    return filterxAxisByWeight(data, intervalLine);
  }
}
