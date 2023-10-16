import { LinearScale } from '../../core/scale/LinearScale';
import { NumericalType } from '../../types';
import { Serie } from './Serie';

interface YAxisData {
  text: string;
  value: number;
}
export class YAxis extends Serie<YAxisData, never, LinearScale> {
  hitTest(x: number, y: number) {
    return false;
  }
  render() {
    if (!this.yScale) {
      return;
    }
    this.dataInView.forEach(({ value, text }) => {
      const center = this.yScale!.convert(value);
      this.painter.drawText(text, {
        x: 0,
        y: center,
        fontSize: 10,
      });
    });
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
  getDataInView(): YAxisData[] {
    if (!this.yScale) {
      return [];
    }
    const distance = this.yScale.range[0] - this.yScale.range[1];
    const lineNumber = this.height / 60 + 1;
    const p = 10 ** -Math.floor(Math.log10(distance / lineNumber));

    const gap = Math.ceil((distance / lineNumber) * p) / p;
    let v = Math.round(this.yScale.range[1] / gap) * gap;
    const data: number[] = [];
    while (v <= this.yScale.range[0]) {
      data.push(v);
      v += gap;
    }
    let dataWithText: YAxisData[] = [];
    if (this.yScale.mode === NumericalType.Percentage) {
      dataWithText = data.map((d) => ({
        text: `${(d * 100).toFixed(2)}%`,
        value: (1 + d) * this.yScale!.percentBase,
      }));
    } else {
      dataWithText = data.map((d) => ({
        text: d.toFixed(2),
        value: d,
      }));
    }
    return dataWithText;
  }
}
