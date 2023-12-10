import { CandleStick, CandleStickWithSwing, Trend } from 'hooks/useFutures/types';

export type ContinuousKlinesToCandleSticksParams = {
  data: number[][];
};

export const continuousKlinesToCandleSticks = ({
  data,
}: ContinuousKlinesToCandleSticksParams): CandleStick[] => {
  return data.map((item: number[]) => {
    return {
      openT: item[0],
      openTime: new Date(item[0]).toLocaleString('pl-PL', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        fractionalSecondDigits: 3,
      }),
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      closeT: item[6],
      closeTime: new Date(item[6]).toLocaleString('pl-PL', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        fractionalSecondDigits: 3,
      }),
    };
  });
};

export const isSwingHigh = (slicedData: CandleStick[]): boolean => {
  const initValue = 0;

  const highestHighIndex = slicedData.reduce((index, item, currentIndex) => {
    return item.high > slicedData[index].high ? currentIndex : index;
  }, initValue);

  return (
    highestHighIndex === (slicedData.length - 1) / 2 &&
    slicedData[highestHighIndex].high > slicedData[highestHighIndex - 1].high &&
    slicedData[highestHighIndex].high > slicedData[highestHighIndex + 1].high
  );
};

export const isSwingLow = (slicedData: CandleStick[]): boolean => {
  const initValue = 0;

  const lowestHighIndex = slicedData.reduce((index, item, currentIndex) => {
    return item.low < slicedData[index].low ? currentIndex : index;
  }, initValue);

  return (
    lowestHighIndex === (slicedData.length - 1) / 2 &&
    slicedData[lowestHighIndex].low < slicedData[lowestHighIndex - 1].low &&
    slicedData[lowestHighIndex].low < slicedData[lowestHighIndex + 1].low
  );
};

export const findNextSwingIndex = (
  candles: CandleStickWithSwing[],
  startIndex: number,
  direction: Trend,
): number => {
  let returnIndex = -1;

  const lastSwingInRowIndex = (startIndex: number) => {
    for (let index = startIndex; index < candles.length; index++) {
      if (
        (direction === Trend.DOWN && candles[index].isSwingLow) ||
        (direction === Trend.UP && candles[index].isSwingHigh)
      ) {
        returnIndex = index;

        lastSwingInRowIndex(index + 1);

        break;
      } else if (
        (direction === Trend.DOWN && candles[index].isSwingHigh) ||
        (direction === Trend.UP && candles[index].isSwingLow)
      ) {
        break;
      }
    }
  };

  lastSwingInRowIndex(startIndex);

  return returnIndex;
};

export const findHighestLowestSwingInRangeIndex = (
  slicedCandles: CandleStickWithSwing[],
  direction: Trend,
): number => {
  const initValue = 0;

  return slicedCandles.reduce((index, item, currentIndex) => {
    if (direction === Trend.DOWN) {
      return item.high > slicedCandles[index].high ? currentIndex : index;
    }

    if (direction === Trend.UP) {
      return item.low < slicedCandles[index].low ? currentIndex : index;
    }

    return index;
  }, initValue);
};

export const findIntersectionCandleIndex = (
  slopeStartTime: number,
  slopeEndTime: number,
  candles: CandleStick[],
  swings: CandleStickWithSwing[],
): number => {
  const startCandleIndex = candles.findIndex((item) => item.openT === slopeEndTime);
  const startSlopeIndex = swings.findIndex(
    (item: CandleStickWithSwing) => item.openT === slopeStartTime,
  );
  const endSlopeIndex = swings.findIndex(
    (item: CandleStickWithSwing) => item.openT === slopeEndTime,
  );
  const startSlopeValue = swings[startSlopeIndex].high; // add condition when trend is up
  const endSlopeValue = swings[endSlopeIndex].low; // add condition when trend is up

  let intersectionCandleIndex = startCandleIndex + 1;
  for (let index = intersectionCandleIndex; index < candles.length; index++) {
    const isUpperIntersection =
      startSlopeValue <= candles[index].high && startSlopeValue >= candles[index].low;
    const isLowerIntersection =
      endSlopeValue <= candles[index].high && endSlopeValue >= candles[index].low;
    if (isLowerIntersection || isUpperIntersection) {
      intersectionCandleIndex = index;

      break;
    }
  }
  return intersectionCandleIndex;
};
