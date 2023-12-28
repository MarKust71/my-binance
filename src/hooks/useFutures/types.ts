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
  volume?: number; // Volume
  quoteVolume?: number; // Quote asset volume
  trades?: number; // Number of trades
  takerBaseAssetVolume?: number; // Taker buy base asset volume
  takerQuoteAssetVolume?: number; // Taker buy quote asset volume
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

export type Trade = {
  id: number;
  price: number;
  qty: number;
  quoteQty: number;
  time: number;
  isBuyerMaker: boolean;
  timeString?: string;
};

export type GetTradeListParams = {
  symbol: string;
  limit?: number;
  startTime?: Date;
  endTime?: Date;
};

export type CandleData = {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  t: number;
  q: number;
};

export type QueryParameter = [key: string, value: string | number | Date | undefined];
