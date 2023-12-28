import { CandleStickWithSwing } from 'hooks/useFutures/types';

export type FuturesStore = {
  candles: CandleStickWithSwing[];
  engulfings: CandleStickWithSwing[];
  fairValueGaps: CandleStickWithSwing[];
  highestSwing: CandleStickWithSwing | null;
  isFetched: boolean;
  isFetching: boolean;
  lowestSwing: CandleStickWithSwing | null;
  swings: CandleStickWithSwing[];
};

export type FuturesActions = {
  setCandles: (candles: CandleStickWithSwing[]) => void;
  setEngulfings: (candles: CandleStickWithSwing[]) => void;
  setFairValueGaps: (candles: CandleStickWithSwing[]) => void;
  setHighestSwing: (highestSwing: CandleStickWithSwing | null) => void;
  setIsFetched: (isFetched: boolean) => void;
  setIsFetching: (isFetching: boolean) => void;
  setLowestSwing: (lowestSwing: CandleStickWithSwing | null) => void;
  setSwings: (swings: CandleStickWithSwing[]) => void;
};
