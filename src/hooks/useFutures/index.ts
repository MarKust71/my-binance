import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getEngulfings } from 'src/helpers/GetEngulfings';
import { getFairValueGaps } from 'src/helpers/GetFairValueGaps';

import { BINANCE_FUTURES_API_URL } from 'hooks/useBinance';
import {
  CandleData,
  CandleStick,
  CandleStickWithSwing,
  FuturesTrade,
  GetTradeListParams,
  QueryParameter,
  Trade,
  Trend,
} from 'hooks/useFutures/types';
import {
  continuousKlinesToCandleSticks,
  findHighestLowestSwingInRangeIndex,
  findIntersectionCandleIndex,
  findNextSwingIndex,
  isSwingHigh,
  isSwingLow,
} from 'hooks/useFutures/helpers';
import { useFuturesStore } from 'store/useFuturesStore';

export const useFutures = () => {
  const { formatDate, formatTime } = useIntl();
  const {
    candles,
    engulfings,
    fairValueGaps,
    setCandles,
    setEngulfings,
    setFairValueGaps,
    setHighestSwing,
    setIsFetched,
    setIsFetching,
    setLowestSwing,
    setSwings,
    swings,
  } = useFuturesStore();

  const [data, setData] = useState<CandleStick[] | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [candle, setCandle] = useState<CandleData | null>(null);

  const getCandleByPeriod = async () => {
    const ENDPOINT = '/fapi/v1/continuousKlines';
    const PAIR = 'BTCUSDT';
    const CONTRACT_TYPE = 'PERPETUAL';
    const INTERVAL = '1m';

    // const startDate = new Date('2023-11-12T15:00:00.000Z');
    // const endDate = new Date('2023-11-12T15:30:00.000Z');
    const startDate = undefined as Date | undefined;
    const endDate = undefined as Date | undefined;

    try {
      setIsFetched(false);
      setIsFetching(true);

      const result = await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}?pair=${PAIR}&interval=${INTERVAL}&contractType=${CONTRACT_TYPE}${
          startDate ? `&startDate=${startDate.getTime()}` : ''
        }${endDate ? `&endTime=${endDate.getTime()}` : ''}`,
        {
          method: 'GET',
        },
      );

      setIsFetching(false);
      setIsFetched(true);

      const data = await result.json();

      const formattedData = continuousKlinesToCandleSticks({ data });

      setData(formattedData);
    } catch (error) {
      setIsFetching(false);

      console.error(error);
    }
  };

  const getSwings = (periods: number) => {
    if (data) {
      const result: CandleStickWithSwing[] = [];

      for (let index = 0; index < data.length; index++) {
        if (index >= periods && index <= data.length - 2 - periods) {
          const slicedData = data.slice(index - periods, index + periods + 1);
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

  const getTradeList = async ({ symbol, limit, startTime, endTime }: GetTradeListParams) => {
    const ENDPOINT = '/fapi/v1/aggTrades';

    const queryParameters: QueryParameter[] = Object.entries({ symbol, limit, startTime, endTime });
    const queryString = queryParameters.reduce((acc, [key, value]) => {
      const isDate = value instanceof Date;

      return value ? `${acc}${acc ? '&' : '?'}${key}=${isDate ? value.getTime() : value}` : acc;
    }, '');

    try {
      setIsFetched(false);
      setIsFetching(true);
      const result = await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}${queryString}`,
        {
          method: 'GET',
        },
      );
      setIsFetching(false);
      setIsFetched(true);

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

      // setData(formattedData);

      const candleData: CandleData = formattedData.reduce(
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
      setIsFetching(false);
      console.error(error);
    }
  };

  const getRecentTrades = async () => {
    const ENDPOINT = '/fapi/v1/trades';
    const SYMBOL = 'BTCUSDT';

    try {
      setIsFetched(false);
      setIsFetching(true);
      const result = await fetch(
        // await fetch(
        // eslint-disable-next-line max-len
        `${BINANCE_FUTURES_API_URL}${ENDPOINT}?symbol=${SYMBOL}`,
        {
          method: 'GET',
        },
      );
      setIsFetching(false);
      setIsFetched(true);

      const data = (await result.json()) as Trade[];

      const formattedData = data.map((item) => {
        return {
          ...item,
          timeString: `${formatDate(item.time)} ${formatTime(item.time, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            fractionalSecondDigits: 3,
          })}`,
        };
      });

      setTrades(formattedData);
    } catch (error) {
      setIsFetching(false);
      console.error(error);
    }
  };

  const checkTrend = useCallback(
    (time: number) => {
      if (!swings?.length || !candles?.length || !time) {
        return;
      }

      const startSlopeIndex = swings.findIndex((item: CandleStickWithSwing) => item.openT === time);

      if (startSlopeIndex === -1 || startSlopeIndex === swings.length - 1) {
        return;
      }

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
        (item) => item.openT === swings[endSlopeIndex]?.openT,
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

  useEffect(() => {
    const engulfings = getEngulfings(candles);
    setEngulfings(engulfings);

    const fairValueGaps = getFairValueGaps(candles);
    setFairValueGaps(fairValueGaps);
  }, [candles]);

  useEffect(() => {
    if (!!engulfings?.length && !!fairValueGaps?.length) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c useFutures: ', 'color: black; background-color: yellow', {
        engulfings,
        fairValueGaps,
      });
    }
  }, [engulfings, fairValueGaps]);

  useEffect(() => {
    getSwings(2);
  }, [data]);

  return {
    candle,
    checkTrend,
    data,
    getCandleByPeriod,
    getRecentTrades,
    getSwings,
    getTradeList,
    trades,
  };
};
