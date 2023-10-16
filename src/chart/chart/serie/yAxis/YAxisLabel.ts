import { LinearScale } from '../../../core/scale/LinearScale';
import { NumericalType } from '../../../types';
import { Serie } from '../Serie';

interface LabelData {
  text?: string;
  value: number;
}
export class YAxisLabel extends Serie<LabelData, never, LinearScale> {
  hitTest(x: number, y: number) {
    return false;
  }
  render() {
    if (!this.yScale) {
      return;
    }
    this.dataInView.forEach(({ value, text }) => {
      const center = this.yScale!.convert(value);
      let label = text;
      if (!label) {
        label =
          this.yScale!.mode === NumericalType.Percentage
            ? `${((value / this.yScale!.percentBase - 1) * 100).toFixed(2)}%`
            : value.toFixed(2);
      }
      this.painter.drawRect({
        x: 0,
        y: center - 8,
        h: 16,
        w: 60,
        color: 'blue',
      });
      this.painter.drawText(label, {
        x: 4,
        y: center,
        fontSize: 12,
        fillStyle: 'white',
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
      m: this.yScale.mode,
      h: this.height,
      b: this.yScale.mode === NumericalType.Percentage ? this.yScale.percentBase : '',
    });
  }
  getDataInView(): LabelData[] {
    if (!this.yScale) {
      return [];
    }
    return this.data;
  }
}
