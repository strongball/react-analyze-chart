import React, { useContext, useEffect, useState } from 'react';
import { OHLC } from '../../../chart/data';
import { BarSeries } from '../../../chart/chart/serie/BarSeries';
import { PlotContext } from '../Plot';
interface Props {
  data: OHLC[];
}
const Bar: React.FC<Props> = (props) => {
  const { data } = props;
  const { plot } = useContext(PlotContext);
  const [series, setSeries] = useState<BarSeries>(new BarSeries());
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
    series.setData(data);
  }, [series, data]);

  return null;
};
export default Bar;
