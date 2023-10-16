import { LinearScale } from '../../core/scale/LinearScale';
import { TimeScale } from '../../core/scale/TimeScale';
import { NumericalType } from '../../types';
import { Serie } from './Serie';

export class BackgroundY extends Serie<number, TimeScale, LinearScale> {
  hitTest(coordX: number, coordY: number) {
    return false;
  }
  render() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const [d1, d2] = this.xScale.domain;
    this.dataInView.forEach((d) => {
      const coordY = this.yScale!.convert(d);
      this.painter.drawLine({
        points: [
          { x: d1, y: coordY },
          { x: d2, y: coordY },
        ],
        color: 'rgba(0,0,0,.1)',
        width: 1,
      });
    });
    if (this.yScale.mode === NumericalType.Percentage) {
      const coordY = this.yScale!.convert(this.yScale.percentBase);
      this.painter.drawLine({
        points: [
          { x: d1, y: coordY },
          { x: d2, y: coordY },
        ],
        color: 'rgba(0,0,0,.5)',
        width: 2,
      });
    }
  }
  getRange() {
    return null;
  }
  getDataInViewKey(): string {
    if (!this.yScale) {
      return '';
    }
    return JSON.stringify({
      r: this.yScale,
      m: this.yScale.mode,
      h: this.height,
      b: this.yScale.mode === NumericalType.Percentage ? this.yScale.percentBase : '',
    });
  }
  getDataInView(): number[] {
    if (!this.yScale) {
      return [];
    }
    const distance = this.yScale.range[0] - this.yScale.range[1];
    const lineNumber = this.height / 60 + 1;
    const dirtyGap = distance / lineNumber;
    const p = 10 ** -Math.floor(Math.log10(dirtyGap));

    const gap = Math.ceil(dirtyGap * p) / p;
    let v = Math.round(this.yScale.range[1] / gap) * gap;
    let data: number[] = [];
    while (v <= this.yScale.range[0]) {
      data.push(v);
      v += gap;
    }
    if (this.yScale.mode === NumericalType.Percentage) {
      data = data.map((d) => (1 + d) * this.yScale!.percentBase);
    }
    return data;
  }
}
