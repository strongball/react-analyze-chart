/* eslint-disable no-unused-vars */
// import('./bootstrap')
import { FinancialChart, FinancialChartOptions } from '../chart/chart/FinancialChart';
import { CandleSerie } from '../chart/chart/serie/CandleSerie';
import { LineSerie } from '../chart/chart/serie/LineSerie';
import { Background } from '../chart/chart/serie/Background';
import { BackgroundY } from '../chart/chart/serie/BackgroundY';
import { QQQ } from '../chart/data';
import { LineDrawing } from '../chart/chart/drawing/LineDrawing';
import { getTimeAxisWithDateAndWeight } from '../chart/core/utils/XAxisDateTick';

import { indicatorMovingAverage } from '@d3fc/d3fc-technical-indicator';
import { YAxisLabel } from './chart/serie/yAxis/YAxisLabel';
import { BarSeries } from './chart/serie/BarSeries';
import { bindHoverEvent, chartWheel, panningX, panningY } from './eventHandler';
import { BandSeries } from './chart/serie/BandSeries';

const data = QQQ;

export function init(options: FinancialChartOptions) {
  const date = getTimeAxisWithDateAndWeight(
    data.map((item) => item.u),
    'M1'
  );
  const baseData = data.reduce((m, d) => m.set(d.u, d.o), new Map());
  const financialChart = new FinancialChart(options);
  const chartPanel = financialChart.findOrCreatePanel('main')!;

  // panningX(financialChart);
  // panningY(chartPanel);
  // chartWheel(chartPanel);

  const mainPlot = chartPanel.plots[0];
  mainPlot.setPercentageBase(baseData);

  const backgroundSerie = new Background();
  const backgroundYSerie = new BackgroundY();
  mainPlot.addSerie(backgroundSerie);
  mainPlot.addSerie(backgroundYSerie);

  financialChart.setXAxisTicks(data.map((d) => d.u));
  backgroundSerie.setData(date);
  financialChart.xAxis.setData(date);

  const candle = new CandleSerie();
  candle.setData(data);
  mainPlot.addSerie(candle);
  bindHoverEvent(candle);

  const volumnPlot = chartPanel.createPlot({
    paddingY: [0.7, 0],
  });
  const barSeries = new BarSeries({});
  barSeries.setData(data);
  volumnPlot.addSerie(barSeries);
  bindHoverEvent(barSeries);
  chartPanel.addRightAxis(volumnPlot);
  /**
   * mouse
   */
  const yAxisLabel = new YAxisLabel();
  chartPanel.tickPanels[0].addLayer(yAxisLabel);
  yAxisLabel.setData([{ value: 303.1 }]);
  chartPanel.addEventListener('mousemove', (evt) => {
    if (!mainPlot.yScale) {
      return;
    }
    const y = mainPlot.yScale.invert(evt.y);
    yAxisLabel.setData([{ value: y }]);
  });
  chartPanel.addEventListener('wheel', (evt) => {
    if (!mainPlot.yScale) {
      return;
    }
    const y = mainPlot.yScale.invert(evt.y);
    yAxisLabel.setData([{ value: y }]);
  });

  const ma5Data = indicatorMovingAverage()
    .period(5)
    .value((x) => x && x['c'])(data);
  const ma5 = new LineSerie({ color: 'red' });
  ma5.setData(data.map((d, idx) => ({ u: d.u, y: ma5Data[idx] ?? null })));
  mainPlot.addSerie(ma5);
  bindHoverEvent(ma5);

  const ma20Data = indicatorMovingAverage()
    .period(20)
    .value((x) => x && x['c'])(data);
  const ma20 = new LineSerie({ color: 'blue' });
  ma20.setData(data.map((d, idx) => ({ u: d.u, y: ma20Data[idx] ?? null })));
  mainPlot.addSerie(ma20);
  bindHoverEvent(ma20);

  // const scatterSerie = new ScatterSerie()
  // scatterSerie.setData(data.map(d => ({ u: d.u, y: d.c })))
  // scatterSerie.setPercentageBase(baseData)
  // panel.addSerie(scatterSerie)

  const bandSeries = new BandSeries();
  bandSeries.setData(data);
  mainPlot.addSerie(bandSeries);
  bindHoverEvent(bandSeries);

  const lineDrawing = new LineDrawing();
  lineDrawing.setData([
    { u: data[data.length - 1].u, y: data[data.length - 1].c },
    { u: data[data.length - 20].u, y: data[data.length - 20].c },
  ]);
  let grabItem;

  lineDrawing.addMouseListener('mousedown', (event) => {
    lineDrawing.setFocus(true);
    grabItem = {
      drawing: lineDrawing,
      t: event.target,
      x: event.coordX,
      y: event.coordY,
    };
    return true;
  });
  lineDrawing.addMouseListener('hover', () => {
    lineDrawing.setFocus(true);
    chartPanel.el.style.cursor = 'grab';
  });
  lineDrawing.addMouseListener('leave', () => {
    if (grabItem?.drawing !== lineDrawing) {
      lineDrawing.setFocus(false);
    }
    chartPanel.el.style.cursor = '';
  });
  mainPlot.addSerie(lineDrawing);
  mainPlot.addMouseListener('mousemove', (event) => {
    if (grabItem) {
      if (grabItem.t === 'all') {
        const diffCoordX = Math.round((event.coordX - grabItem.x) / grabItem.drawing.xScale.gap);
        const diffCoordY = event.coordY - grabItem.y;
        grabItem.x = grabItem.x + diffCoordX * grabItem.drawing.xScale.gap;
        grabItem.y = event.coordY;
        grabItem.drawing.move(diffCoordX, diffCoordY);
      } else {
        grabItem.drawing.setDataByKeyAndCoord(grabItem.t, {
          x: event.coordX,
          y: event.coordY,
        });
      }
      return true;
    }
  });
  mainPlot.addMouseListener('mouseup', (event) => {
    grabItem = undefined;
  });
  mainPlot.addMouseListener('mousedown', (event) => {
    lineDrawing.setFocus(false);
  });
  return financialChart;
}
// document.getElementById('m-linear')!.onclick = () => {
//   financialChart.setMainPlotYMode(NumericalType.Linear);
// };
// document.getElementById('m-log')!.onclick = () => {
//   financialChart.setMainPlotYMode(NumericalType.Log);
// };
// document.getElementById('m-percent')!.onclick = () => {
//   financialChart.setMainPlotYMode(NumericalType.Percentage);
// };

// document.getElementById('w-400')!.onclick = () => {
//   financialChart.width = 400;
// };
// document.getElementById('w-800')!.onclick = () => {
//   financialChart.width = 800;
// };
// document.getElementById('w-1200')!.onclick = () => {
//   financialChart.width = 1200;
// };
// document.getElementById('h-400')!.onclick = () => {
//   financialChart.height = 400;
// };
// document.getElementById('h-600')!.onclick = () => {
//   financialChart.height = 600;
// };
// document.getElementById('h-800')!.onclick = () => {
//   financialChart.height = 800;
// };

// document.getElementById('add')!.onclick = () => {
//   mainPlot.addSerie(candle);
// };
// document.getElementById('remove')!.onclick = () => {
//   mainPlot.removeSerie(candle);
// };
