export type QueryParams = {
  [key: string]: string | number;
};

export type Trade = {
  p: number;
  q: number;
};

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  NONE = 'none',
}

export type PriceChangeDirectionParams = {
  prevPrice: number;
  price: number;
};
