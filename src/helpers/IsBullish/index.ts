import { BasicCandle } from 'src/types';

export const isBullish = (candle: BasicCandle): boolean => candle.close > candle.open;
