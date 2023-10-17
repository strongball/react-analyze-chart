import React, { useMemo } from 'react';
import { OHLC } from '../../../chart/data';
import { indicatorMovingAverage } from '@d3fc/d3fc-technical-indicator';
import LineSeries from './LineSeries';
import { LineConfig } from '../../../chart/chart/serie/LineSerie';

interface Props {
  length: number;
  data: OHLC[];
  lineConfig?: Partial<LineConfig>;
}
const MASeries: React.FC<Props> = (props) => {
  const { data, length, lineConfig } = props;
  const ma = useMemo(() => {
    const maData = indicatorMovingAverage()
      .period(length)
      .value((x) => x && x['c'])(data);
    return data.map((d, idx) => ({ u: d.u, y: maData[idx] ?? null }));
  }, [data, length]);

  return <LineSeries data={ma} lineConfig={lineConfig} />;
};
export default MASeries;
