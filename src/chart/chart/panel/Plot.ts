import { CanvasPanel } from '../../core/panel/CanvasPanel';
import { Scaleable, ScaleableOptions } from '../../core/scale/Scaleable';
import { LinearScale } from '../../core/scale/LinearScale';
import { TimeScale } from '../../core/scale/TimeScale';
import { Serie } from '../serie/Serie';
import { LayerMouseEventListener, LayerMouseEventType } from '../../core/layer/Layer';
import { NumericalType, Timestamp } from '../../types';

interface PlotOptions extends ScaleableOptions<TimeScale, LinearScale> {
  canvasPanel: CanvasPanel<TimeScale, LinearScale>;
  paddingY?: [number, number];
}
export type PercentageBase = Map<Timestamp, number>;

export class Plot extends Scaleable<TimeScale, LinearScale> {
  private _series: Serie[] = [];
  private safeSyncYScaleBySeries: this['syncYScaleBySeries'];
  private _paddingY?: [number, number];

  autoReScale = true;
  canvasPanel: CanvasPanel<TimeScale, LinearScale>;
  subPlots: Set<Plot> = new Set();

  percentageBase?: PercentageBase;
  setPercentageBase(data: PercentageBase) {
    this.percentageBase = data;
  }
  constructor({ xScale, yScale, paddingY, canvasPanel }: PlotOptions) {
    super({ xScale, yScale });
    this.canvasPanel = canvasPanel;
    this._paddingY = paddingY;
    this.addScaleListener(this.watchScaleChange.bind(this));
    this.safeSyncYScaleBySeries = this.syncYScaleBySeries.bind(this);
    this.bindHTMLEvent();
  }

  addSyncPlot(plot: Plot) {
    this.subPlots.add(plot);
    plot.autoReScale = false;
    plot.safeSyncYScaleBySeries = this.safeSyncYScaleBySeries;
  }
  removeSyncPlot(plot: Plot) {
    this.subPlots.delete(plot);
    plot.autoReScale = true;
    plot.safeSyncYScaleBySeries = plot.syncYScaleBySeries.bind(plot);
    this.safeSyncYScaleBySeries();
  }
  addSerie(serie: Serie<any, TimeScale, LinearScale>) {
    this._series.push(serie);
    serie.yScale = this.yScale;
    this.canvasPanel.addLayer(serie);
    serie.addViewRangeListener(this.safeSyncYScaleBySeries);
    this.syncYScaleBySeries();
  }
  removeSerie(serie: Serie<any, TimeScale, LinearScale>) {
    this._series = this._series.filter((s) => s !== serie);
    serie.yScale = undefined;
    this.canvasPanel.removeLayer(serie);
    serie.removeViewRangeListener(this.safeSyncYScaleBySeries);
    this.syncYScaleBySeries();
  }

  getRangeBySeries(): [number, number] | null {
    if (!this.xScale) {
      throw new Error('xScale not exist');
    }
    const allRanges = this._series
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((s) => s.viewRange ?? [])
      .flat();
    let min = Math.min(...allRanges);
    let max = Math.max(...allRanges);
    if (this.yScale?.mode === 'Percentage') {
      const base = this.getCurrentPercentageBase();
      if (base) {
        min = min / base - 1;
        max = max / base - 1;
      }
    }
    const subRanges = Array.from(this.subPlots)
      .map((p) => p.getRangeBySeries() ?? [])
      .flat();

    if (allRanges.length === 0 && subRanges.length === 0) {
      return null;
    }

    min = Math.min(min, ...subRanges);
    max = Math.max(max, ...subRanges);
    return [max, min];
  }
  getCurrentPercentageBase(): number | undefined {
    const leftTime = this.xScale?.rangeTimestamp[0];
    const base = leftTime ? this.percentageBase?.get(leftTime) : undefined;
    return base;
  }
  private updatePercentBase() {
    if (!this.xScale || !this.yScale) {
      return;
    }
    const base = this.getCurrentPercentageBase();
    this.yScale.percentBase = base ?? 0;
  }
  syncYScaleBySeries() {
    if (!this.autoReScale) {
      return;
    }
    const range = this.getRangeBySeries();
    if (!range || !this.yScale) {
      return;
    }
    this.yScale.setRange(range);
    this.yScale.padding = this._paddingY;
  }
  private syncSubPlots() {
    if (!this.yScale) {
      return;
    }
    this.subPlots.forEach((plot) => {
      plot.yScale!.mode = this.yScale!.mode;
      plot.yScale?.setRange(this.yScale!.range);
      plot.yScale?.setDomain(this.yScale!.domain);
    });
  }
  private watchScaleChange() {
    this.updatePercentBase();
    this.safeSyncYScaleBySeries();
    this.syncSubPlots();
  }
  private mouseEventListeners: {
    [K in LayerMouseEventType]: Set<LayerMouseEventListener>;
  } = {
    click: new Set(),
    dblclick: new Set(),
    mousedown: new Set(),
    mouseup: new Set(),
    mousemove: new Set(),
    hover: new Set(),
    leave: new Set(),
  };

  public addMouseListener(type: LayerMouseEventType, l: LayerMouseEventListener) {
    this.mouseEventListeners[type].add(l);
  }
  public removeMouseListener(type: LayerMouseEventType, l: LayerMouseEventListener) {
    this.mouseEventListeners[type].delete(l);
  }

  private bindHTMLEvent() {
    const events = ['click', 'dblclick', 'mouseup', 'mousedown', 'mousemove'] as const;
    events.forEach((eventName) => {
      this.canvasPanel.el.addEventListener(eventName, (evt: MouseEvent) => {
        const rect = this.canvasPanel.el.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;

        let pause = this._series.some((l) => l.doMouseEvent(eventName, x, y));
        if (!pause) {
          pause = Array.from(this.mouseEventListeners[eventName]).some((l) =>
            l({
              coordX: x,
              coordY: y,
              target: 'plot',
            })
          );
        }
        if (pause) {
          evt.stopPropagation();
        }
      });
    });
  }
}
