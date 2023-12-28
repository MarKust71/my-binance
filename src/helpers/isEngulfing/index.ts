import { BasicCandle } from 'src/types';
import { isBullish } from 'src/helpers/IsBullish';
import { isBearish } from 'src/helpers/IsBearish';

export const isEngulfing = (candle: BasicCandle, previousCandle: BasicCandle): boolean => {
  if (isBullish(candle) && isBearish(previousCandle)) {
    return candle.close > previousCandle.open && candle.open < previousCandle.close;
  }

  if (isBearish(candle) && isBullish(previousCandle)) {
    return candle.close < previousCandle.open && candle.open > previousCandle.close;
  }

  return false;
};
