import { QQQData } from './qqq';

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
export async function getStock(code: string): Promise<StockData[]> {
  const rowData = QQQData;
  return rowData
    .map((row) => ({
      date: row.Date,
      open: row.Open,
      high: row.High,
      low: row.Low,
      close: row.Close,
      volume: row.Volume,
    }))
    .reverse();
}
