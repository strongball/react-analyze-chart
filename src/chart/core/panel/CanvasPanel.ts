import { Layer } from '../layer/Layer';
import { getPixelRatio } from '../painter/CanvasPainter';
import { Scale } from '../scale/Scale';
import { Panel, PanelOptions } from './interface';

interface CanvasPanelOptions<TX extends Scale, TY extends Scale> extends PanelOptions<TX, TY> {
  key: string;
  el: HTMLCanvasElement;
}
export class CanvasPanel<TX extends Scale, TY extends Scale> extends Panel<TX, TY> {
  key: string;
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  layers: Layer<TX, TY>[] = [];
  composeLock = false;

  safeComposite: this['composite'];
  constructor({ key, el, xScale, yScale }: CanvasPanelOptions<TX, TY>) {
    super({ el, xScale, yScale });
    this.key = key;
    this.el = el;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = el.getContext('2d')!;
    this.safeComposite = this.composite.bind(this);
  }

  addLayer(layer: Layer<TX, TY>) {
    this.layers.push(layer);
    layer.addRenderListener(this.safeComposite);
    if (this.xScale) {
      layer.xScale = this.xScale;
    } else {
      layer.width = this.width;
    }
    if (this.yScale) {
      layer.yScale = this.yScale;
    } else {
      layer.height = this.height;
    }
  }
  removeLayer(layer: Layer<TX, TY>) {
    layer.removeRenderListener(this.safeComposite);
    this.layers = this.layers.filter((l) => l !== layer);
    this.composite();
  }

  composite() {
    if (this.composeLock) {
      return;
    }
    this.composeLock = true;
    requestAnimationFrame(() => {
      this.composeLock = false;
      this._composite();
    });
  }

  private _composite() {
    const pixelRatio = getPixelRatio();
    this.el.width = this.width * pixelRatio;
    this.el.height = this.height * pixelRatio;
    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';

    this.ctx.resetTransform();
    this.ctx.scale(pixelRatio, pixelRatio);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
    this.layers.forEach((layer) => {
      const img = layer.toCanvasImageSource();
      try {
        this.ctx.drawImage(img, 0, 0, img.width as number, img.height as number, 0, 0, this.width, this.height);
      } catch (err) {
        // pass
      }
    });
  }
}
