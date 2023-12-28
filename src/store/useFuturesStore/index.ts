import { create } from 'zustand';

import { FuturesActions, FuturesStore } from 'store/useFuturesStore/types';
import { CandleStickWithSwing } from 'hooks/useFutures/types';

const initialValues: FuturesStore = {
  candles: [],
  engulfings: [],
  fairValueGaps: [],
  highestSwing: null,
  isFetched: false,
  isFetching: false,
  lowestSwing: null,
  swings: [],
};

const initialActions: FuturesActions = {
  setCandles: () => {},
  setEngulfings: () => {},
  setFairValueGaps: () => {},
  setHighestSwing: () => {},
  setIsFetched: () => {},
  setIsFetching: () => {},
  setLowestSwing: () => {},
  setSwings: () => {},
};

export const useFuturesStore = create<FuturesStore & FuturesActions>((set) => ({
  ...initialValues,
  ...initialActions,

  setCandles: (candles: CandleStickWithSwing[]) =>
    set((state) => ({
      ...state,
      candles,
    })),

  setSwings: (swings: CandleStickWithSwing[]) =>
    set((state) => ({
      ...state,
      swings,
    })),

  setLowestSwing: (lowestSwing: CandleStickWithSwing | null) =>
    set((state) => ({ ...state, lowestSwing })),

  setHighestSwing: (highestSwing: CandleStickWithSwing | null) =>
    set((state) => ({ ...state, highestSwing })),

  setEngulfings: (engulfings: CandleStickWithSwing[]) => set((state) => ({ ...state, engulfings })),

  setFairValueGaps: (fairValueGaps: CandleStickWithSwing[]) =>
    set((state) => ({ ...state, fairValueGaps })),

  setIsFetching: (isFetching: boolean) => set((state) => ({ ...state, isFetching })),

  setIsFetched: (isFetched: boolean) => set((state) => ({ ...state, isFetched })),
}));
