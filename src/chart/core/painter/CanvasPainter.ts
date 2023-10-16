import {
  DrawTextOptions,
  DrawRectOptions,
  DrawLineOptions,
  Painter,
  DrawCircleOptions,
  DrawAreaOptions,
} from './interface';

export function getPixelRatio() {
  return (window && window.devicePixelRatio) || 1;
}

interface BoxSize {
  width: number;
  height: number;
}
export class CanvasPainter extends Painter {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pixelRatio: number = 1;
  constructor({ width, height }: BoxSize) {
    super({ width, height });
    this.canvas = document.createElement('canvas');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = this.canvas.getContext('2d')!;
    this.setSize({ width, height });
  }
  override setSize({ width, height }: BoxSize) {
    if (!this.canvas) {
      return;
    }
    const newRatio = getPixelRatio();
    if (this.width === width && this.height === height && newRatio === this.pixelRatio) {
      return;
    }
    this.width = width;
    this.height = height;
    this.pixelRatio = getPixelRatio();
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;

    this.ctx.resetTransform();
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }
  drawRect({ x, y, w, h, color, padding: [paddingY, paddingX] = [0, 0] }: DrawRectOptions) {
    // this.ctx.save()
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + paddingX, y + paddingY, w - paddingX * 2, h - paddingY * 2);
    // this.ctx.restore()
  }

  drawCircle({ cx, cy, size, lineWidth, fillStyle, strokeStyle }: DrawCircleOptions) {
    // this.ctx.save()
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, size, 0, 2 * Math.PI, false);
    this.fillAndStroke({ lineWidth, fillStyle, strokeStyle });

    // this.ctx.restore()
  }
  drawLine({ points, color, width = 1 }: DrawLineOptions): void {
    // this.ctx.save()
    this.ctx.lineWidth = width;
    color && (this.ctx.strokeStyle = color);
    this.ctx.beginPath();
    points.forEach(({ x, y }, index) => {
      if (index === 0) {
        this.ctx.moveTo(x, y);
        return;
      }
      this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
    // this.ctx.restore()
  }

  drawText(text: string, { x, y, fillStyle, fontSize }: DrawTextOptions) {
    // this.ctx.save()
    fillStyle && (this.ctx.fillStyle = fillStyle);
    fontSize && (this.ctx.font = `${fontSize}px Noto Sans`);
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
    // this.ctx.restore()
  }
  drawArea({ points, fillStyle, lineWidth, strokeStyle }: DrawAreaOptions) {
    // this.ctx.save()
    this.ctx.beginPath();

    points.forEach(({ x, y }, index) => {
      if (index === 0) {
        this.ctx.moveTo(x, y);
        return;
      }
      this.ctx.lineTo(x, y);
    });
    this.ctx.closePath();

    this.fillAndStroke({ lineWidth, fillStyle, strokeStyle });
    // this.ctx.restore()
  }

  fillAndStroke({
    fillStyle,
    lineWidth,
    strokeStyle,
  }: Pick<DrawAreaOptions, 'fillStyle' | 'lineWidth' | 'strokeStyle'>) {
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill();
    }
    if (strokeStyle) {
      if (lineWidth) {
        this.ctx.lineWidth = lineWidth;
      }
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke();
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  toCanvasImageSource() {
    return this.canvas;
  }
}
