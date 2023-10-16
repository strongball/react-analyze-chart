import { CanvasPainter } from '../painter/CanvasPainter';
import { Painter } from '../painter/interface';
import { Scale } from '../scale/Scale';
import { Scaleable, ScaleableOptions } from '../scale/Scaleable';

export type LayerMouseEventType = 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mousemove' | 'hover' | 'leave';
export interface LayerMouseEvent {
  coordX: number;
  coordY: number;
  target?: string;
}
export type LayerMouseEventListener = (event: LayerMouseEvent) => boolean | void;
export interface LayerOptions<TX extends Scale, TY extends Scale> extends ScaleableOptions<TX, TY> {
  zIndex?: number;
}
export type LayerRenderListener = () => void;
export abstract class Layer<TX extends Scale, TY extends Scale> extends Scaleable<TX, TY> {
  painter: Painter = new CanvasPainter({ width: 0, height: 0 });
  private isHover: boolean = false;
  zIndex = 1;
  protected abstract render(): void;
  protected abstract hitTest(x: number, y: number): boolean | string;

  constructor(options?: LayerOptions<TX, TY>) {
    super(options);
    this.zIndex = options?.zIndex ?? 1;
    this.addScaleListener(this.watchScaleChange.bind(this));
  }

  public toCanvasImageSource(): CanvasImageSource {
    return this.painter.toCanvasImageSource();
  }
  watchScaleChange() {
    this.painter.setSize({
      width: this.width,
      height: this.height,
    });
    this.updateLayer();
  }

  public updateLayer() {
    this.painter.clear();
    this.render();
    this.triggerRenderListener();
  }

  private renderListeners: Set<LayerRenderListener> = new Set();
  protected triggerRenderListener() {
    this.renderListeners.forEach((l) => l());
  }
  public addRenderListener(l: LayerRenderListener) {
    this.renderListeners.add(l);
  }
  public removeRenderListener(l: LayerRenderListener) {
    this.renderListeners.delete(l);
  }

  public doMouseEvent(type: LayerMouseEventType, coordX: number, coordY: number): boolean {
    const listenHoverLeave = this.mouseEventListeners['hover'].size > 0;
    if (this.mouseEventListeners[type].size === 0 && !listenHoverLeave) {
      return false;
    }
    const result = this.hitTest(coordX, coordY);
    if (listenHoverLeave) {
      this.handleHoverLeave(result, coordX, coordY);
    }
    if (!result) {
      return false;
    }
    const listenerResults = Array.from(this.mouseEventListeners[type]).map((l) =>
      l({
        coordX,
        coordY,
        target: result.toString(),
      })
    );
    return listenerResults.some((r) => r);
  }
  private handleHoverLeave(target: string | boolean, coordX: number, coordY: number) {
    if (!target && this.isHover) {
      this.isHover = false;
      setTimeout(() => {
        if (!this.isHover) {
          this.mouseEventListeners['leave'].forEach((l) =>
            l({
              coordX,
              coordY,
              target: target.toString(),
            })
          );
        }
      }, 10);
    }
    if (target) {
      this.isHover = true;
      this.mouseEventListeners['hover'].forEach((l) =>
        l({
          coordX,
          coordY,
          target: target.toString(),
        })
      );
    }
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
}
