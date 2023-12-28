import { isFairValueGap } from 'src/helpers/isFairValueGap';

import { CandleStickWithSwing } from 'hooks/useFutures/types';

export const getFairValueGaps = (data: CandleStickWithSwing[]) => {
  const result: CandleStickWithSwing[] = [];

  const minMaxPrice = { min: 0, max: 0 };

  for (let index = data.length - 1; index >= 0; index--) {
    if (index >= 1 && index <= data.length - 3) {
      const slicedData = data.slice(index - 1, index + 2);
      const isFairValueGapResult = isFairValueGap(slicedData, { ...minMaxPrice });

      if (isFairValueGapResult) {
        result.push({
          ...data[index],
        });
      }
    }

    if (index === data.length - 1) {
      minMaxPrice.min = data[index].low;
      minMaxPrice.max = data[index].high;
    } else {
      if (data[index].low < minMaxPrice.min) {
        minMaxPrice.min = data[index].low;
      }
      if (data[index].high > minMaxPrice.max) {
        minMaxPrice.max = data[index].high;
      }
    }
  }

  return result;
};
