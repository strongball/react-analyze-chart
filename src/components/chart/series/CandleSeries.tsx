import React, { useContext, useEffect, useState } from 'react';
import { OHLC } from '../../../chart/data';
import { CandleSerie as ChartCandleSerie } from '../../../chart/chart/serie/CandleSerie';
import { PlotContext } from '../Plot';
interface Props {
  data: OHLC[];
}
const CandleSeries: React.FC<Props> = (props) => {
  const { data } = props;
  const { plot } = useContext(PlotContext);
  const [series, setSeries] = useState<ChartCandleSerie>(new ChartCandleSerie());
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
export default CandleSeries;
