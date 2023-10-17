import React, { useContext, useEffect, useState } from 'react';
import { PlotContext } from '../Plot';
import { LineSerie as ChartLineSerie, LineConfig, LineData } from '../../../chart/chart/serie/LineSerie';

interface Props {
  data: LineData[];
  lineConfig?: Partial<LineConfig>;
}
const LineSeries: React.FC<Props> = (props) => {
  const { data, lineConfig } = props;
  const { plot } = useContext(PlotContext);
  const [series, setSeries] = useState<ChartLineSerie>(new ChartLineSerie());
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
    series.updateConfig(lineConfig);
  }, [series, lineConfig]);
  useEffect(() => {
    series.setData(data);
  }, [series, data]);

  return null;
};
export default LineSeries;
