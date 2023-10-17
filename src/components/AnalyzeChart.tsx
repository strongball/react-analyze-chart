import React, { useMemo } from 'react';
import Chart from './chart/Chart';
import Panel from './chart/Panel';
import BackgroundSeries from './chart/series/BackgroundSeries';
import { OHLC } from '../chart/data';
import CandleSeries from './chart/series/CandleSeries';
import BackgroundYSeries from './chart/series/BackgroundYSeries';
import Plot from './chart/Plot';
import Bar from './chart/series/Bar';
import MASeries from './chart/series/MASeries';

interface Props {
  data: OHLC[];
}
const AnalyzeChart: React.FC<Props> = (props) => {
  const { data } = props;
  const timestamps = useMemo(() => data.map((item) => item.u), [data]);

  return (
    <Chart>
      <Panel name="main">
        <BackgroundSeries data={timestamps} />
        <BackgroundYSeries />
        <Plot paddingY={[0.7, 0]}>
          <Bar data={data} />
        </Plot>
        <CandleSeries data={data} />
        <MASeries data={data} length={5} lineConfig={{ color: 'blue' }} />
        <MASeries data={data} length={20} lineConfig={{ color: 'red' }} />
      </Panel>
    </Chart>
  );
};
export default AnalyzeChart;
