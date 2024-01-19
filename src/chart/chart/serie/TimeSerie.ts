import { LinearScale } from '../../core/scale/LinearScale';
import { TimeScale } from '../../core/scale/TimeScale';
import { Timestamp } from '../../types';
import { Serie, SerieOptions } from './Serie';
import { sliceDataInView } from './utils';

export interface TimeValueData {
  u: Timestamp;
}
export type PercentageBase = Map<Timestamp, number>;

export type TimeSeriesOptions<T extends TimeValueData> = SerieOptions<T, TimeScale, LinearScale>;
export abstract class TimeSerie<T extends TimeValueData> extends Serie<T, TimeScale, LinearScale> {
  constructor(options?: TimeSeriesOptions<T>) {
    super(options);
  }
  getDataInViewKey(): string {
    if (!this.xScale || !this.yScale) {
      return '';
    }
    return `${this.xScale.rangeTimestamp[0]}-${this.xScale.rangeTimestamp[1]}-${this.yScale.mode}`;
  }
  getDataInView(): T[] {
    if (!this.xScale || !this.yScale) {
      return [];
    }
    const [start, end] = this.xScale!.rangeTimestamp;
    console.log(start, end);
    const data = sliceDataInView(this.data, {
      start,
      end,
      moreLeft: 1,
      moreRight: 1,
    });
    return data;
  }
}
