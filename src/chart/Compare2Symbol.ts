/* eslint-disable no-unused-vars */
// import('./bootstrap')
import { FinancialChart } from './chart/FinancialChart';
import { CandleSerie } from './chart/serie/CandleSerie';
import { LineSerie } from './chart/serie/LineSerie';
// import { ScatterSerie } from '../chart/chart/serie/ScatterSerie'
import { Background } from './chart/serie/Background';
import { BackgroundY } from './chart/serie/BackgroundY';
// import { BandSerie } from '../chart/chart/serie/BandSerie'
import { QQQ, VIX } from './data';
import { NumericalType } from './types';
import { getTimeAxisWithDateAndWeight } from './core/utils/XAxisDateTick';
const date = getTimeAxisWithDateAndWeight(
  QQQ.map((d, i) => [i, d.u]),
  'M1'
).map(([_, u, text, p]) => ({
  u: u,
  text: text,
  priority: p,
}));
const baseData = QQQ.reduce((m, d) => m.set(d.u, d.o), new Map());
const financialChart = new FinancialChart({
  el: document.getElementById('main')! as HTMLDivElement,
});

const chartPanel = financialChart.findOrCreatePanel('main')!;
const mainPlot = chartPanel.plots[0];
mainPlot.setPercentageBase(baseData);

const backgroundSerie = new Background();
const backgroundYSerie = new BackgroundY();
mainPlot.addSerie(backgroundSerie);
mainPlot.addSerie(backgroundYSerie);

financialChart.setXAxisTicks(QQQ.map((d) => d.u));
backgroundSerie.setData(date);
financialChart.xAxis.setData(date);

const qqqLine = new LineSerie({
  width: 4,
  color: 'green',
});
qqqLine.setData(QQQ.map((d) => ({ u: d.u, y: (d.o + d.c) / 2 })));
mainPlot.addSerie(qqqLine);

/**
 * sub plot
 */
const baseData2 = VIX.reduce((m, d) => m.set(d.u, d.o), new Map());
const subPlot = chartPanel.createPlot();
subPlot.setPercentageBase(baseData2);
mainPlot.addSyncPlot(subPlot);

// chartPanel.addRightAxis(subPlot)

const vixLine = new LineSerie({
  width: 4,
});
vixLine.setData(VIX.map((d) => ({ u: d.u, y: (d.o + d.c) / 2 })));
subPlot.addSerie(vixLine);

let mouseDownXBase: number | undefined = undefined;
let mouseDownYBase: number | undefined = undefined;
financialChart.addEventListener('mousedown', (evt) => {
  mouseDownXBase = evt.x;
  mouseDownYBase = evt.y;
});
financialChart.addEventListener('mouseup', (evt) => {
  mouseDownXBase = undefined;
  mouseDownYBase = undefined;
});
financialChart.addEventListener('mousemove', (evt) => {
  if (mouseDownXBase !== undefined) {
    const wantChange = mouseDownXBase - evt.x;
    if (Math.abs(wantChange) > 1) {
      financialChart.xScale?.move(wantChange);
      mouseDownXBase = evt.x;
    }
  }
  if (mouseDownYBase !== undefined) {
    const wantChange = mouseDownYBase - evt.y;
    if (Math.abs(wantChange) > 1) {
      financialChart.chartPanels[0].plots[0].yScale?.move(wantChange);
      mouseDownYBase = evt.y;
    }
  }
});

document.getElementById('m-linear')!.onclick = () => {
  financialChart.setMainPlotYMode(NumericalType.Linear);
};
document.getElementById('m-log')!.onclick = () => {
  financialChart.setMainPlotYMode(NumericalType.Log);
};
document.getElementById('m-percent')!.onclick = () => {
  financialChart.setMainPlotYMode(NumericalType.Percentage);
};

document.getElementById('w-400')!.onclick = () => {
  financialChart.width = 400;
};
document.getElementById('w-800')!.onclick = () => {
  financialChart.width = 800;
};
document.getElementById('w-1200')!.onclick = () => {
  financialChart.width = 1200;
};
document.getElementById('h-400')!.onclick = () => {
  financialChart.height = 400;
};
document.getElementById('h-600')!.onclick = () => {
  financialChart.height = 600;
};
document.getElementById('h-800')!.onclick = () => {
  financialChart.height = 800;
};
