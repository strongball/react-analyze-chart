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
import { PercentageBase } from '../chart/chart/panel/Plot';
import { NumericalType } from '../chart/types';
import LineSeries from './chart/series/LineSeries';

interface Props {
  data: OHLC[];
  secondData?: OHLC[];
  mode?: NumericalType;
  show5MA?: boolean;
  show20MA?: boolean;
  showVolumn?: boolean;
}
const AnalyzeChart: React.FC<Props> = (props) => {
  const { data, secondData, mode, show5MA, show20MA, showVolumn } = props;
  const timestamps = useMemo(() => data.map((item) => item.u), [data]);
  const baseValue = useMemo<PercentageBase>(() => data.reduce((m, d) => m.set(d.u, d.c), new Map()), [data]);
  const secondDataBaseValue = useMemo<PercentageBase>(
    () => secondData?.reduce((m, d) => m.set(d.u, d.c), new Map()) ?? new Map(),
    [secondData]
  );
  return (
    <Chart mode={mode}>
      <Panel name="main" percentageBase={baseValue}>
        <BackgroundSeries data={timestamps} />
        <BackgroundYSeries />
        {showVolumn && (
          <Plot paddingY={[0.7, 0]} percentageBase={baseValue}>
            <Bar data={data} />
          </Plot>
        )}
        {mode == 'Percentage' ? (
          <LineSeries data={data.map((item) => ({ u: item.u, y: item.c }))} />
        ) : (
          <CandleSeries data={data} />
        )}
        {secondData && (
          <Plot sync percentageBase={secondDataBaseValue}>
            <LineSeries data={secondData.map((item) => ({ u: item.u, y: item.c }))} lineConfig={{ color: 'red' }} />
          </Plot>
        )}
        {show5MA && <MASeries data={data} length={5} lineConfig={{ color: 'blue' }} />}{' '}
        {show20MA && <MASeries data={data} length={20} lineConfig={{ color: 'red' }} />}
      </Panel>
    </Chart>
  );
};
export default AnalyzeChart;
