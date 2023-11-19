import { Direction, PriceChangeDirectionParams } from './types';

export const priceChangeDirection = ({
  prevPrice,
  price,
}: PriceChangeDirectionParams): Direction => {
  if (price > prevPrice) {
    return Direction.UP;
  }

  if (price < prevPrice) {
    return Direction.DOWN;
  }

  return Direction.NONE;
};
