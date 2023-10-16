import qqq from './QQQ_M1.json';
import vix from './VIX_M1.json';
export interface OHLC {
  u: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export const QQQ: OHLC[] = qqq
  .map((d) => ({
    u: Number(d.u),
    o: Number(d.o),
    h: Number(d.h),
    l: Number(d.l),
    c: Number(d.c),
    v: Number(d.v),
  }))
  .reverse();
export const VIX: OHLC[] = vix
  .map((d) => ({
    u: Number(d.u),
    o: Number(d.o),
    h: Number(d.h),
    l: Number(d.l),
    c: Number(d.c),
    v: Number(d.v),
  }))
  .reverse();
