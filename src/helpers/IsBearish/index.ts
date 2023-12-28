import { BasicCandle } from 'src/types';

export const isBearish = (candle: BasicCandle): boolean => candle.close < candle.open;
