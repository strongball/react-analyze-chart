import React, { useContext, useEffect, useState } from 'react';
import { Background } from '../../../chart/chart/serie/Background';
import { getTimeAxisWithDateAndWeight } from '../../../chart/core/utils/XAxisDateTick';
import { ChartContext } from '../Chart';
import { PlotContext } from '../Plot';

interface Props {
  data: number[];
}
const BackgroundSeries: React.FC<Props> = (props) => {
  const { data } = props;
  const { chart } = useContext(ChartContext);
  const { plot } = useContext(PlotContext);

  const [series, setSeries] = useState<Background>(new Background());
  useEffect(() => {
    if (!series || !plot) {
      return;
    }
    plot.addSerie(series);
    return () => {
      plot.removeSerie(series);
    };
  }, [plot, series]);

  useEffect(() => {
    if (!chart || !series || !plot) {
      return;
    }
    const date = getTimeAxisWithDateAndWeight(data, 'M1');
    series.setData(date);
    // const baseData = data.reduce((m, d) => m.set(d.u, d.o), new Map());
    // plot.setPercentageBase(baseData);

    chart.setXAxisTicks(data);
    chart.xAxis.setData(date);
  }, [chart, plot, series, data]);
  return null;
};
export default BackgroundSeries;
