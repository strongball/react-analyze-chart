import { Scale } from './Scale';

export interface ScaleableOptions<TXScale extends Scale, TYScale extends Scale> {
  xScale?: TXScale;
  yScale?: TYScale;
}
export abstract class Scaleable<TXScale extends Scale, TYScale extends Scale> {
  private _width: number = 0;
  get width(): number {
    if (!this.xScale) {
      return this._width;
    }
    const [s, e] = this.xScale.domain;
    return Math.abs(s - e);
  }
  set width(w: number) {
    if (w == this.width) {
      return;
    }
    if (this.xScale) {
      this.xScale?.setDomain([0, w]);
    } else {
      this._width = w;
      this.onScaleChange();
    }
  }
  private _height: number = 0;
  get height(): number {
    if (!this.yScale) {
      return this._height;
    }
    const [s, e] = this.yScale.domain;
    return Math.abs(s - e);
  }
  set height(h: number) {
    if (h === this.height) {
      return;
    }
    if (this.yScale) {
      this.yScale?.setDomain([0, h]);
    } else {
      this._height = h;
      this.onScaleChange();
    }
  }

  private _xScale?: TXScale;
  public get xScale(): TXScale | undefined {
    return this._xScale;
  }
  public set xScale(scale: TXScale | undefined) {
    if (this._xScale === scale) {
      return;
    }
    this._xScale?.removeScaleListener(this.safeOnScaleChange);
    this._xScale = scale;
    this._xScale?.addScaleListener(this.safeOnScaleChange);
    this.onScaleChange();
  }

  private _yScale?: TYScale;
  public get yScale(): TYScale | undefined {
    return this._yScale;
  }
  public set yScale(scale: TYScale | undefined) {
    if (this._yScale === scale) {
      return;
    }
    this._yScale?.removeScaleListener(this.safeOnScaleChange);
    this._yScale = scale;
    this._yScale?.addScaleListener(this.safeOnScaleChange);
    this.onScaleChange();
  }
  safeOnScaleChange: this['onScaleChange'];
  constructor(options?: ScaleableOptions<TXScale, TYScale>) {
    this.safeOnScaleChange = this.onScaleChange.bind(this);
    if (options) {
      this.xScale = options.xScale;
      this.yScale = options.yScale;
    }
  }

  private scaleListeners: Set<() => void> = new Set();
  protected triggerScaleListener() {
    this.scaleListeners.forEach((l) => l());
  }
  protected addScaleListener(listener: () => void) {
    this.scaleListeners.add(listener);
  }
  protected removeScaleListener(listener: () => void) {
    this.scaleListeners.delete(listener);
  }

  /**
   * This will trigger in constructor but some attr are not init. Let do it later.
   */
  onScaleChange() {
    this.triggerScaleListener();
  }

  destory() {
    this.xScale = undefined;
    this.yScale = undefined;
  }
  public unlistenAllScale() {
    this.xScale?.removeScaleListener(this.safeOnScaleChange);
    this.yScale?.removeScaleListener(this.safeOnScaleChange);
  }
}
