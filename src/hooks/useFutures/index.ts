import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import { BINANCE_FUTURES_API_URL } from 'hooks/useBinance';
import { CandleStickWithSwing, FuturesTrade, Trend } from 'hooks/useFutures/types';
import {
  continuousKlinesToCandleSticks,
  findHighestLowestSwingInRangeIndex,
  findIntersectionCandleIndex,
  findNextSwingIndex,
  isSwingHigh,
  isSwingLow,
} from 'hooks/useFutures/helpers';

export const useFutures = () => {
  const { formatDate, formatTime } = useIntl();

  const [data, setData] = useState<any>(null);
  const [candle, setCandle] = useState<any>(null);
  const [candles, setCandles] = useState<CandleStickWithSwing[]>([]);
  const [swings, setSwings] = useState<CandleStickWithSwing[]>([]);
  const [lowestSwing, setLowestSwing] = useState<CandleStickWithSwing | null>(null);
  const [highestSwing, setHighestSwing] = useState<CandleStickWithSwing | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const getCandleByPeriod = async () => {
    const ENDPOINT = '/fapi/v1/continuousKlines';
    const PAIR = 'BTCUSDT';
    const CONTRACT_TYPE = 'PERPETUAL';
    const INTERVAL = '5m';

    // const startDate = new Date('2023-11-12T15:00:00.000Z');
    // const endDate = new Date('2023-11-12T15:30:00.000Z');
    const startDate = undefined as Date | undefined;
    const endDate = undefined as Date | undefined;

    try {
      setIsFetched(() => false);
      setIsFetching(() => true);
      const result = await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}?pair=${PAIR}&interval=${INTERVAL}&contractType=${CONTRACT_TYPE}${
          startDate ? `&startDate=${startDate.getTime()}` : ''
        }${endDate ? `&endTime=${endDate.getTime()}` : ''}`,
        {
          method: 'GET',
        },
      );
      setIsFetching(() => false);
      setIsFetched(() => true);

      const data = await result.json();

      const formattedData = continuousKlinesToCandleSticks({ data });

      setData(formattedData);
    } catch (error) {
      setIsFetching(() => false);
      console.error(error);
    }
  };

  const getSwings = async (period: number) => {
    if (!isEmpty(data)) {
      const result: CandleStickWithSwing[] = [];

      for (let index = 0; index < data.length; index++) {
        if (index >= period && index <= data.length - 2 - period) {
          const slicedData = data.slice(index - period, index + period + 1);
          const isSwingHighResult = isSwingHigh(slicedData);
          const isSwingLowResult = isSwingLow(slicedData);

          result.push({
            ...data[index],
            isSwingHigh: isSwingHighResult,
            isSwingLow: isSwingLowResult,
          });
        } else {
          result.push({
            ...data[index],
            isSwingHigh: false,
            isSwingLow: false,
          });
        }
      }

      setCandles(result);
      setSwings(result.filter((swing) => swing.isSwingHigh || swing.isSwingLow));

      const highestSwingResult = result.reduce((acc, item) => {
        return item.isSwingHigh && item.high > acc.high ? item : acc;
      }, result[0]);

      setHighestSwing(highestSwingResult);

      const lowestSwingResult = result.reduce((acc, item) => {
        return item.isSwingLow && item.low < acc.low ? item : acc;
      }, result[0]);

      setLowestSwing(lowestSwingResult);
    }
  };

  const getTradeList = async () => {
    const ENDPOINT = '/fapi/v1/aggTrades';
    const SYMBOL = 'BTCUSDT';
    // const LIMIT = 1000;
    const LIMIT = undefined as number | undefined;

    // const startDate = new Date('2023-11-12T15:21:00.000Z');
    // const endDate = new Date('2023-11-12T15:22:00.000Z');
    const startTime = undefined as Date | undefined;
    const endTime = undefined as Date | undefined;

    try {
      setIsFetched(() => false);
      setIsFetching(() => true);
      const result = await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}?symbol=${SYMBOL}${
          startTime ? `&startTime=${startTime.getTime()}` : ''
        }${endTime ? `&endTime=${endTime.getTime()}` : ''}${LIMIT ? `&limit=${LIMIT}` : ''}`,
        {
          method: 'GET',
        },
      );
      setIsFetching(() => false);
      setIsFetched(() => true);

      const data = (await result.json()) as FuturesTrade[];

      const filteredData = data.filter((item) => {
        if (startTime && endTime) {
          return item.T <= endTime.getTime() && item.T >= startTime.getTime();
        }

        return data;
      });

      const formattedData = filteredData.map((item) => {
        return {
          ...item,
          time: `${formatDate(item.T)} ${formatTime(item.T, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            fractionalSecondDigits: 3,
          })}`,
        };
      });

      setData(formattedData);

      const candleData = formattedData.reduce(
        (acc, item) => {
          return {
            o: acc.o,
            h: acc.h > item.p ? acc.h : item.p,
            l: acc.l < item.p ? acc.l : item.p,
            c: item.p,
            v: Number(acc.v) + Number(item.q),
            t: startTime ? startTime.getTime() : formattedData[0].T,
            q: acc.q + 1,
          };
        },
        {
          o: formattedData[0].p,
          h: formattedData[0].p,
          l: formattedData[0].p,
          c: formattedData[0].p,
          v: formattedData[0].q,
          t: startTime ? startTime.getTime() : formattedData[0].T,
          q: 1,
        },
      );

      setCandle(candleData);
    } catch (error) {
      setIsFetching(() => false);
      console.error(error);
    }
  };

  const getCurrentTradeList = async () => {
    const ENDPOINT = '/fapi/v1/aggTrades';
    const SYMBOL = 'BTCUSDT';

    try {
      setIsFetched(() => false);
      setIsFetching(() => true);
      const result = await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}?symbol=${SYMBOL}`,
        {
          method: 'GET',
        },
      );
      setIsFetching(() => false);
      setIsFetched(() => true);

      const data = (await result.json()) as FuturesTrade[];

      const formattedData = data.map((item) => {
        return {
          ...item,
          time: `${formatDate(item.T)} ${formatTime(item.T, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            fractionalSecondDigits: 3,
          })}`,
        };
      });

      setData(formattedData);
    } catch (error) {
      setIsFetching(() => false);
      console.error(error);
    }
  };

  const checkTrend = useCallback(
    (time: number) => {
      const startSlopeIndex = swings.findIndex((item: CandleStickWithSwing) => item.openT === time);

      let trend = Trend.NONE;
      if (swings[startSlopeIndex].isSwingHigh && !swings[startSlopeIndex].isSwingLow) {
        trend = Trend.DOWN;
      }
      if (swings[startSlopeIndex].isSwingLow && !swings[startSlopeIndex].isSwingHigh) {
        trend = Trend.UP;
      }

      let endSlopeIndex = startSlopeIndex + 1;

      // find the end of the first slope
      for (let index = startSlopeIndex + 1; index < swings.length; index++) {
        if (swings[startSlopeIndex].isSwingHigh && swings[index].isSwingLow) {
          endSlopeIndex = index;

          break;
        }
      }

      // find the closest intersection
      const candleStickIndex = candles.findIndex(
        (item) => item.openT === swings[endSlopeIndex].openT,
      );

      const intersectionCandleIndex = findIntersectionCandleIndex(
        swings[startSlopeIndex].openT,
        swings[endSlopeIndex].openT,
        candles,
        swings,
      );

      const nextSwingIndex = findNextSwingIndex(candles, intersectionCandleIndex, trend);

      const middleOppositeSwingIndex =
        candleStickIndex +
        findHighestLowestSwingInRangeIndex(candles.slice(candleStickIndex, nextSwingIndex), trend);

      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c  ', 'color: black; background-color: yellow', {
        startSlope: swings[startSlopeIndex],
        endSlope: candles[candleStickIndex],
        middleOppositeSwing: candles[middleOppositeSwingIndex],
        nextSwing: candles[nextSwingIndex],
        intersectionCandle: candles[intersectionCandleIndex],
      });
    },
    [swings, candles],
  );

  return {
    candle,
    candles,
    checkTrend,
    data,
    getCandleByPeriod,
    getCurrentTradeList,
    getSwings,
    getTradeList,
    highestSwing,
    isFetched,
    isFetching,
    lowestSwing,
    swings,
  };
};
