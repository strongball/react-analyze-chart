import React from 'react';
import SimplaeChart from '../components/SimplaeChart';
import AnalyzeChart from '../components/AnalyzeChart';
import { QQQ, VIX } from '../chart/data';

interface Props {}
const ChartPage: React.FC<Props> = (props) => {
  return (
    <div>
      {/* <SimplaeChart /> */}
      <AnalyzeChart data={QQQ} secondData={VIX} />
    </div>
  );
};
export default ChartPage;
