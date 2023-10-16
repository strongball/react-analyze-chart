import { Layer, LayerOptions } from '../../core/layer/Layer';
import { Scale } from '../../core/scale/Scale';

export type ViewRangeListener = () => void;
export interface SerieOptions<TData, TX extends Scale, TY extends Scale> extends LayerOptions<TX, TY> {
  data?: TData[];
}
export abstract class Serie<TData = any, TX extends Scale = Scale, TY extends Scale = Scale> extends Layer<TX, TY> {
  data: TData[] = [];

  private _dataInViewCacheKey: string | undefined;
  private _dataInView: TData[] = [];
  get dataInView(): TData[] {
    return this._dataInView;
  }
  set dataInView(data: TData[]) {
    this._dataInView = data;
    this.viewRange = this.getRange();
  }

  private _viewRange: [number, number] | null = null;
  get viewRange(): [number, number] | null {
    return this._viewRange;
  }
  set viewRange(range: [number, number] | null) {
    if (
      this._viewRange === range ||
      (this._viewRange !== null && range !== null && this._viewRange[0] === range[0] && this._viewRange[1] === range[1])
    ) {
      return;
    }
    this._viewRange = range;
    this.triggerViewRangeListener();
  }

  constructor(options?: SerieOptions<TData, TX, TY>) {
    super(options);
    if (options?.data) {
      this.setData(options.data);
    }
    this.addScaleListener(() => {
      this.updateViewData();
    });
  }
  setData(data: TData[]) {
    this.data = data;
    this._dataInViewCacheKey = undefined;
    this.updateViewData();
  }

  private updateViewData() {
    const newKey = this.getDataInViewKey?.() ?? '';
    if (this._dataInViewCacheKey === newKey) {
      return;
    }
    this._dataInViewCacheKey = newKey;

    this.dataInView = this.getDataInView();
    this.updateLayer();
  }

  _viewRangeListeners: Set<ViewRangeListener> = new Set();
  protected triggerViewRangeListener() {
    this._viewRangeListeners.forEach((l) => l());
  }
  addViewRangeListener(listener: ViewRangeListener) {
    this._viewRangeListeners.add(listener);
  }
  removeViewRangeListener(listener: ViewRangeListener) {
    this._viewRangeListeners.delete(listener);
  }
  abstract getRange(): [number, number] | null;
  abstract getDataInView(): TData[];
  abstract getDataInViewKey(): string;
}
