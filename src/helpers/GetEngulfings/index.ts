import { isEngulfing } from 'src/helpers/isEngulfing';

import { CandleStickWithSwing } from 'hooks/useFutures/types';

export const getEngulfings = (data: CandleStickWithSwing[]) => {
  const result: CandleStickWithSwing[] = [];

  for (let index = data.length - 1; index >= 0; index--) {
    if (index >= 1 && index <= data.length - 2) {
      const slicedData = data.slice(index - 1, index + 2);
      const isEngulfingResult = isEngulfing(slicedData[1], slicedData[0]);

      if (isEngulfingResult) {
        result.push({
          ...data[index],
        });
      }
    }
  }

  return result;
};
