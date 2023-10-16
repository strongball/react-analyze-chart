import { Timestamp } from '../../types';

export interface SliceDataInViewOptions {
  start: Timestamp;
  end: Timestamp;
  moreLeft?: number;
  moreRight?: number;
}
export interface BaseViewData {
  u: Timestamp;
}
export function sliceDataInView<T extends BaseViewData = BaseViewData>(
  data: T[],
  { start, end, moreLeft, moreRight }: SliceDataInViewOptions
): T[] {
  let startIdx = -1;
  let endIdx = -1;

  for (let i = 0; i < data.length; i++) {
    if (startIdx === -1) {
      // find start
      if (data[i].u >= start) {
        startIdx = i;
        endIdx = i;
      }
    } else {
      const next = i + 1;
      if (next === data.length || data[next].u > end) {
        endIdx = i;
        break;
      }
    }
  }
  if (startIdx === -1) {
    return [];
  }
  if (moreLeft) {
    startIdx = Math.max(0, startIdx - moreLeft);
  }
  if (moreRight) {
    endIdx = Math.min(data.length - 1, endIdx + moreRight);
  }

  return data.slice(startIdx, endIdx + 1);
}
