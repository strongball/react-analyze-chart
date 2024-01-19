import React, { useState } from 'react';
import SimplaeChart from '../components/SimplaeChart';
import AnalyzeChart from '../components/AnalyzeChart';
import { QQQ, VIX } from '../chart/data';
import { NumericalType } from '../chart/types';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

interface Props {}
const ChartPage: React.FC<Props> = (props) => {
  const [mode, setMode] = useState<NumericalType>('Linear');
  const [showVIX, setShowVIX] = useState<boolean>(false);
  const [showVolumn, setShowVolumn] = useState<boolean>(false);
  const [show20MA, setShow20MA] = useState<boolean>(false);
  const [show5MA, setShow5MA] = useState<boolean>(false);
  const modeOptions: NumericalType[] = ['Linear', 'Log', 'Percentage'];
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12}>
        <TextField
          select
          label="Scale Type"
          value={mode}
          variant="standard"
          onChange={(e) => setMode(e.target.value as NumericalType)}
          style={{ width: 180 }}
        >
          {modeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel control={<Checkbox checked={showVIX} onClick={() => setShowVIX(!showVIX)} />} label="VIX" />
        <FormControlLabel
          control={<Checkbox checked={showVolumn} onClick={() => setShowVolumn(!showVolumn)} />}
          label="Volumn"
        />
        <FormControlLabel control={<Checkbox checked={show5MA} onClick={() => setShow5MA(!show5MA)} />} label="5MA" />
        <FormControlLabel
          control={<Checkbox checked={show20MA} onClick={() => setShow20MA(!show20MA)} />}
          label="20MA"
        />
      </Grid2>
      <Grid2 xs={12}>
        <AnalyzeChart
          data={QQQ}
          secondData={showVIX ? VIX : undefined}
          mode={mode}
          showVolumn={showVolumn}
          show5MA={show5MA}
          show20MA={show20MA}
        />
      </Grid2>
    </Grid2>
  );
};
export default ChartPage;
