import { CanvasPanel } from '../core/panel/CanvasPanel';
import { Panel } from '../core/panel/interface';
import { LinearScale } from '../core/scale/LinearScale';
import { TimeScale } from '../core/scale/TimeScale';
import { NumericalType, Timestamp } from '../types';
import { ChartPanel } from './panel/ChartPanel';
import { XAxis } from './serie/XAxis';

export interface FinancialChartOptions {
  el: HTMLDivElement;
}
export class FinancialChart extends Panel<TimeScale, LinearScale> {
  chartPanels: ChartPanel[];
  xAxis: XAxis;
  xAxisPanel: CanvasPanel<TimeScale, never>;

  rootEle: HTMLTableElement = document.createElement('table');

  constructor({ el }: FinancialChartOptions) {
    super({
      el,
      xScale: new TimeScale(),
      yScale: new LinearScale(),
    });
    this.width = 1600;
    this.height = 600;
    this.el.appendChild(this.rootEle);

    this.chartPanels = [];

    this.xAxisPanel = new CanvasPanel<TimeScale, never>({
      key: 'XAxis',
      el: document.createElement('canvas'),
      xScale: this.xScale,
    });
    this.xAxisPanel.height = 40;
    this.xAxis = new XAxis();
    this.xAxisPanel.addLayer(this.xAxis);

    this.buildHTML();
    this.addScaleListener(() => {
      this.chartPanels.forEach((chartPanel) => {
        chartPanel.height = this.height;
      });
    });
  }

  findOrCreatePanel(key: string): ChartPanel | null {
    let panel = this.chartPanels.find((p) => p.key === key);
    if (!panel) {
      panel = new ChartPanel({
        key: key,
        el: document.createElement('tr'),
        xScale: this.xScale,
      });
      panel.height = this.height;
      this.chartPanels.push(panel);

      this.buildHTML();
    }
    return panel;
  }
  setMainPlotYMode(mode: NumericalType) {
    if (this.chartPanels[0].plots[0].yScale) {
      this.chartPanels[0].plots[0].yScale.mode = mode;
    }
  }
  setXAxisTicks(x: Timestamp[]) {
    this.xScale?.setTicks(x);
    this.xScale?.setPivot(x[x.length - 1]);
  }

  buildHTML() {
    this.el.innerHTML = '';
    this.chartPanels.forEach((chartPanel) => {
      this.el.appendChild(chartPanel.el);
    });
    this.el.appendChild(this.xAxisPanel.el);
  }
}
