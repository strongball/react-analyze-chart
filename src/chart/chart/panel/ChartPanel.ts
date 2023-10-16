import { CanvasPanel } from '../../core/panel/CanvasPanel';
import { Panel, PanelOptions } from '../../core/panel/interface';
import { LinearScale } from '../../core/scale/LinearScale';
import { TimeScale } from '../../core/scale/TimeScale';
import { YAxis } from '../serie/YAxis';
import { Plot } from './Plot';

interface ChartPanelOptions extends Omit<PanelOptions<TimeScale, never>, 'yScale'> {
  key: string;
  el: HTMLTableRowElement;
}
export class ChartPanel extends Panel<TimeScale, never> {
  key: string;
  plots: Plot[] = [];
  el: HTMLTableRowElement;
  contentPanel: CanvasPanel<TimeScale, LinearScale>;
  tickPanels: CanvasPanel<never, LinearScale>[] = [];
  constructor({ key, el, xScale }: ChartPanelOptions) {
    super({ el, xScale });
    this.key = key;
    this.el = el;
    this.contentPanel = new CanvasPanel({
      key: 'MainChart',
      el: document.createElement('canvas'),
      xScale: this.xScale,
    });
    this.el.appendChild(this.contentPanel.el);

    this.contentPanel.el.tabIndex = 1;
    this.contentPanel.el.style.border = '1px black solid';

    this.addScaleListener(this.watchScaleChange.bind(this));
    this.createPlot();
  }
  buildHTML() {
    this.el.innerHTML = '';
    const td = document.createElement('td');
    td.appendChild(this.contentPanel.el);
    this.el.appendChild(td);
    this.tickPanels.forEach((tickPanel) => {
      const td = document.createElement('td');
      td.appendChild(tickPanel.el);
      this.el.appendChild(td);
    });
  }

  watchScaleChange(): void {
    this.plots?.forEach((p) => this.syncPlot(p));
    if (this.contentPanel) {
      this.contentPanel.height = this.height;
    }
    this.tickPanels.forEach((tickPanel) => {
      tickPanel.height = this.height;
    });
  }
  addPlot(plot: Plot) {
    this.plots.push(plot);
    this.syncPlot(plot);
    if (this.tickPanels.length === 0) {
      this.addRightAxis(plot);
    }
  }
  syncPlot(plot: Plot) {
    plot.height = this.height;
    plot.width = this.width;
  }
  createPlot({ paddingY }: { paddingY?: [number, number] } = {}) {
    const plot = new Plot({
      xScale: this.xScale,
      yScale: new LinearScale(),
      canvasPanel: this.contentPanel,
      paddingY: paddingY,
    });
    this.addPlot(plot);
    return plot;
  }
  addRightAxis(plot: Plot) {
    const tickPanel = new CanvasPanel<never, LinearScale>({
      key: `YAxis-${this.tickPanels.length + 1}`,
      el: document.createElement('canvas'),
      yScale: plot.yScale,
    });
    tickPanel.width = 60;
    this.tickPanels.push(tickPanel);
    this.buildHTML();

    const yAxis = new YAxis();
    tickPanel.addLayer(yAxis);

    tickPanel.el.addEventListener('wheel', (evt) => {
      if (plot.yScale) {
        plot.autoReScale = false;
        const gap = (plot.yScale.range[0] - plot.yScale.range[1]) * evt.deltaY * 0.001;
        plot.yScale.setRange([plot.yScale.range[0] + gap, plot.yScale.range[1] - gap]);
      }
    });
    tickPanel.el.addEventListener('dblclick', (evt) => {
      if (plot.yScale) {
        plot.autoReScale = true;
        plot.syncYScaleBySeries();
      }
    });
  }
}
