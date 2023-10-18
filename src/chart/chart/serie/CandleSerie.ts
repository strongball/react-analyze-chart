import { OHLC } from '../../data';
import { TimeSerie } from './TimeSerie';

export class CandleSerie extends TimeSerie<OHLC> {
  hitTest(coordX: number, coordY: number) {
    const x = this.xScale?.invert(coordX) ?? null;
    const y = this.yScale?.invert(coordY) ?? null;
    const hitColumns =
      x !== null &&
      y !== null &&
      this.data.filter((d) => {
        if (d.u !== x) {
          return false;
        }
        return y <= d.h && y >= d.l;
      });
    if (hitColumns && hitColumns.length > 0) {
      return 'c';
    }
    return false;
  }

  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const gap = this.xScale!.gap;
    const padding = gap > 6 ? 2 : 1;
    this.dataInView.forEach((v) => {
      const cv = this.xScale!.convert(v.u);
      const cOpen = this.yScale!.convert(v.o);
      const cClose = this.yScale!.convert(v.c);
      const cTop = this.yScale!.convert(v.h);
      const cLow = this.yScale!.convert(v.l);
      // console.log({ o: v.o, cOpen });
      const cOCTop = Math.min(cOpen, cClose);
      const cOCLow = Math.max(cOpen, cClose);
      const color = v.c > v.o ? 'rgb(0, 186, 52)' : 'rgb(233, 44, 44)';
      if (gap > 4) {
        this.painter.drawRect({
          x: cv - gap / 2,
          y: cOCTop,
          w: gap,
          h: cOCLow - cOCTop,
          color: color,
          padding: [0, padding],
        });
        this.painter.drawLine({
          points: [
            { x: cv, y: cTop },
            { x: cv, y: cOCTop },
          ],
          width: 1,
          color: color,
        });
        this.painter.drawLine({
          points: [
            { x: cv, y: cLow },
            { x: cv, y: cOCLow },
          ],
          width: 1,
          color: color,
        });
      } else {
        this.painter.drawLine({
          points: [
            { x: cv, y: cTop },
            { x: cv, y: cLow },
          ],
          width: 1,
          color: color,
        });
      }
    });
  }
  getRange(): [number, number] {
    const dataInView = this.dataInView.map((d) => [d.h, d.l]).flat();
    const max = Math.max(...dataInView);
    const min = Math.min(...dataInView);
    const paddingValue = (max - min) * 0.2;
    return [min - paddingValue, max + paddingValue];
  }
}
