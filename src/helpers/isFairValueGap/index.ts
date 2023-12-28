import { isBullish } from 'src/helpers/IsBullish';
import { isBearish } from 'src/helpers/IsBearish';

import { CandleStickWithSwing } from 'hooks/useFutures/types';

export const isFairValueGap = (
  data: CandleStickWithSwing[],
  minMaxPrice: { min: number; max: number },
) => {
  if (data.length !== 3) return false;

  if (isBullish(data[1])) {
    const gap = {
      high: Math.min(data[2].high, data[2].low, data[1].high),
      low: Math.max(data[0].high, data[0].low, data[1].low),
      value:
        Math.min(data[2].high, data[2].low, data[1].high) -
        Math.max(data[0].high, data[0].low, data[1].low),
    };

    return (
      // data[1].open <= data[0].high &&
      // data[1].close >= data[2].low &&
      gap.value > 0 && (gap.high > minMaxPrice.max || gap.low < minMaxPrice.min)
    );
  }

  if (isBearish(data[1])) {
    const gap = {
      high: Math.min(data[0].high, data[0].low, data[1].high),
      low: Math.max(data[2].high, data[1].high, data[1].low),
      value:
        Math.min(data[0].high, data[0].low, data[1].high) -
        Math.max(data[2].high, data[2].low, data[1].low),
    };

    return (
      // data[1].open >= data[0].low &&
      // data[1].close <= data[2].high &&
      gap.value > 0 && (gap.high > minMaxPrice.max || gap.low < minMaxPrice.min)
    );
  }

  return false;
};
