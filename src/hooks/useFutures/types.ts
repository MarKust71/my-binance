export type FuturesTrade = {
  a: number; // Aggregate tradeId
  p: number; // Price
  q: number; // Quantity
  f: number; // First tradeId
  l: number; // Last tradeId
  T: number; // Timestamp
  m: boolean; // Was the buyer the maker?
};

export type CandleStick = {
  open: number; // Open
  high: number; // High
  low: number; // Low
  close: number; // Close
  openT: number; // Timestamp
  closeT: number; // Timestamp
  openTime?: string; // Timestring
  closeTime?: string; // Timestring
};

export type CandleStickWithSwing = CandleStick & {
  isSwingHigh: boolean;
  isSwingLow: boolean;
};

export enum Trend {
  DOWN = 'down',
  NONE = 'none',
  UP = 'up',
}
