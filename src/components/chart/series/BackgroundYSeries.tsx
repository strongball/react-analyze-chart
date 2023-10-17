import React, { useContext, useEffect, useState } from 'react';
import { BackgroundY } from '../../../chart/chart/serie/BackgroundY';
import { PlotContext } from '../Plot';

interface Props {}
const BackgroundYSeries: React.FC<Props> = (props) => {
  const { plot } = useContext(PlotContext);
  const [series, setSeries] = useState<BackgroundY>(new BackgroundY());
  useEffect(() => {
    if (!series || !plot) {
      return;
    }
    plot.addSerie(series);
    return () => {
      plot.removeSerie(series);
    };
  }, [plot, series]);
  return null;
};
export default BackgroundYSeries;
