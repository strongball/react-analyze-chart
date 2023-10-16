import { TimeScale } from '../../core/scale/TimeScale';
import { filterxAxisByWeight } from '../../core/utils/XAxisDateTick';
import { Timestamp } from '../../types';
import { Serie } from './Serie';
import { sliceDataInView } from './utils';

export interface XAxisData {
  u: Timestamp;
  text: string;
  priority: number;
}
export class XAxis extends Serie<XAxisData, TimeScale, never> {
  hitTest(x: number, y: number) {
    return false;
  }
  render() {
    if (!this.xScale) {
      return;
    }
    this.dataInView.forEach((d) => {
      const coordX = this.xScale!.convert(d.u);
      // console.log({
      //   v,coordX
      // })
      this.painter.drawText(d.text, {
        x: coordX,
        y: 10,
        fontSize: 10,
      });
    });
  }

  getRange() {
    return null;
  }
  getDataInViewKey(): string {
    if (!this.xScale) {
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
