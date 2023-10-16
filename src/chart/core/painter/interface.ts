interface BoxSize {
  width: number;
  height: number;
}
export interface CoordPoint {
  x: number;
  y: number;
}
export abstract class Painter {
  width: number = 0;
  height: number = 0;
  constructor(options: BoxSize) {
    this.setSize(options);
  }
  setSize({ width, height }: BoxSize) {
    this.width = width;
    this.height = height;
  }
  abstract clear(): void;
  abstract toCanvasImageSource(): CanvasImageSource;
  abstract drawRect(options: DrawRectOptions): void;
  abstract drawCircle(options: DrawCircleOptions): void;
  abstract drawLine(options: DrawLineOptions): void;
  abstract drawArea(options: DrawAreaOptions);
  abstract drawText(text: string, options: DrawTextOptions);
}

type Color = string;
export interface DrawRectOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  color: Color;
  padding?: [number, number];
}
export interface DrawCircleOptions {
  cx: number;
  cy: number;
  size: number;
  lineWidth?: number;
  fillStyle?: string;
  strokeStyle?: string;
}
export interface DrawLineOptions {
  points: CoordPoint[];
  color: Color;
  width: number;
}
export interface DrawAreaOptions {
  points: CoordPoint[];
  lineWidth?: number;
  fillStyle?: string;
  strokeStyle?: string;
}
export interface DrawTextOptions {
  x: number;
  y: number;
  fillStyle?: string;
  fontSize?: number;
}
