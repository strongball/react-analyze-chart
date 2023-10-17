import { BoxSize } from '../../types';
import { Scale } from '../scale/Scale';
import { Scaleable, ScaleableOptions } from '../scale/Scaleable';

export type PanelEventType = 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mousemove' | 'wheel' | 'mouseleave';

export interface PanelEvent<T extends PanelEventType> {
  x: number;
  y: number;
  originalEvent: HTMLElementEventMap[T];
}
export type PanelEventListener<T extends PanelEventType> = (e: PanelEvent<T>) => boolean | void;

export interface PanelOptions<TX extends Scale, TY extends Scale> extends ScaleableOptions<TX, TY> {
  el: HTMLElement;
}
export abstract class Panel<TX extends Scale, TY extends Scale> extends Scaleable<TX, TY> {
  el: HTMLElement;
  listeners: { [K in PanelEventType]?: Set<PanelEventListener<K>> } = {};
  constructor({ el, xScale, yScale }: PanelOptions<TX, TY>) {
    super({ xScale, yScale });
    this.el = el;
  }
  addEventListener<K extends PanelEventType>(name: K, cb: PanelEventListener<K>) {
    if (!this.listeners[name]) {
      this.listeners[name] = new Set<any>();
      this.el.addEventListener(name, (evt) => {
        const rect = this.el.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        this.listeners[name]?.forEach((l) => l({ x, y, originalEvent: evt }));
      });
    }
    this.listeners[name]?.add(cb);
  }
  removeEventListener<K extends PanelEventType>(name: K, cb: PanelEventListener<K>) {
    this.listeners[name]?.delete(cb);
  }

  setSize({ width, height }: BoxSize) {
    this.width = width;
    this.height = height;
  }
}
