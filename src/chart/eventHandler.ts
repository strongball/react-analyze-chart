import { FinancialChart } from './chart/FinancialChart';
import { ChartPanel } from './chart/panel/ChartPanel';
import { Serie } from './chart/serie/Serie';

export function panningX(financialChart: FinancialChart) {
  let mouseDownXBase: number | undefined = undefined;
  financialChart.addEventListener('mousedown', (evt) => {
    mouseDownXBase = evt.x;
  });
  financialChart.addEventListener('mouseup', (evt) => {
    mouseDownXBase = undefined;
  });
  financialChart.addEventListener('mouseleave', (evt) => {
    mouseDownXBase = undefined;
  });
  financialChart.addEventListener('mousemove', (evt) => {
    if (mouseDownXBase !== undefined) {
      const wantChange = mouseDownXBase - evt.x;
      if (Math.abs(wantChange) > 1) {
        financialChart.xScale?.move(wantChange);
        mouseDownXBase = evt.x;
      }
    }
  });
}

export function panningY(target: ChartPanel) {
  let mouseDownYBase: number | undefined = undefined;
  target.addEventListener('mousedown', (evt) => {
    mouseDownYBase = evt.y;
  });
  target.addEventListener('mouseup', (evt) => {
    mouseDownYBase = undefined;
  });
  target.addEventListener('mousemove', (evt) => {
    if (mouseDownYBase !== undefined) {
      const wantChange = mouseDownYBase - evt.y;
      if (Math.abs(wantChange) > 1) {
        target.plots[0].yScale?.move(wantChange);
        mouseDownYBase = evt.y;
      }
    }
  });
}
export function chartWheel(target: ChartPanel) {
  target.addEventListener('wheel', ({ x, originalEvent }) => {
    if (target.contentPanel.el.contains(originalEvent.target as HTMLElement)) {
      if (target.xScale) {
        target.xScale.zooming(originalEvent.deltaY / 1000, target.xScale.invert(x));
      }
      if (target.xScale) {
        target.xScale?.move(target.xScale.offset + originalEvent.deltaX);
      }
    }
  });
}

export function bindHoverEvent(serie: Serie) {
  serie.addMouseListener('hover', () => {
    document.body.style.cursor = 'pointer';
  });
  serie.addMouseListener('leave', () => {
    document.body.style.cursor = '';
  });
}
