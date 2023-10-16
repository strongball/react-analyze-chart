export type ScaleListener = () => void;
export abstract class Scale<T = any> {
  listenerLock = false;
  fixRange = false;
  private _padding?: [number, number];
  get padding() {
    return this._padding;
  }
  set padding(padding: [number, number] | undefined) {
    if (
      this._padding === padding ||
      (this._padding && padding && this._padding[0] === padding[0] && this._padding[1] === padding[1])
    ) {
      return;
    }
    this._padding = padding;
    this.triggerScaleListener();
  }
  abstract range: [number, number];
  public setRange(range: [number, number]) {
    if (this.range[0] === range[0] && this.range[1] === range[1]) {
      return;
    }

    this.range = range;
    this.triggerScaleListener();
  }

  abstract convert(v: T): number;
  abstract invert(p: number): T;

  public domain: [number, number] = [0, 0];
  public setDomain(domain: [number, number]) {
    this.domain = domain;
    this.triggerScaleListener();
  }
  get domainInRange(): [number, number] {
    if (!this.padding) {
      return this.domain;
    }
    const size = this.domain[1] - this.domain[0];
    return [this.domain[0] + size * this.padding[0], this.domain[1] - size * this.padding[1]];
  }

  private scaleListeners: Set<ScaleListener> = new Set();
  protected triggerScaleListener() {
    if (this.listenerLock) {
      return;
    }
    this.listenerLock = true;
    requestAnimationFrame(() => {
      this.listenerLock = false;
      this.scaleListeners.forEach((l) => l());
    });
  }
  public addScaleListener(listener: ScaleListener) {
    this.scaleListeners.add(listener);
  }
  public removeScaleListener(listener: ScaleListener) {
    this.scaleListeners.delete(listener);
  }
}
