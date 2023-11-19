import { create } from 'zustand';

import { Values, ValuesActions, ValuesStore } from 'store/useValuesStore/types';

const initialValues: ValuesStore = {
  values: {
    'p0.01': 0,
    'p0.1': 0,
    p1: 0,
    p10: 0,
    p50: 0,
    p100: 0,
    p200: 0,
    p500: 0,
    p1000: 0,
    p2000: 0,
    p5000: 0,
    p10000: 0,
    p1000000: 0,
  },
};

const initialActions: ValuesActions = {
  addValue: () => {},
  clearValues: () => {},
  initValues: () => {},
};

export const useValuesStore = create<ValuesStore & ValuesActions>((set) => ({
  ...initialValues,
  ...initialActions,

  initValues: () =>
    set((state) => ({
      ...state,
      ...initialValues,
    })),

  addValue: (value) =>
    set((state) => {
      const newValues: Values = { ...state.values };

      Object.keys(newValues).every((key) => {
        const keyValue = Number(key.replace('p', ''));

        if (value <= keyValue) {
          newValues[key] += 1;

          return false;
        }

        return true;
      });

      return {
        ...state,
        values: newValues,
      };
    }),

  updateValues: (values: typeof initialValues.values) =>
    set((state) => ({
      ...state,
      values: {
        ...state.values,
        ...values,
      },
    })),

  clearValues: () =>
    set((state) => ({
      ...state,
      values: initialValues.values,
    })),
}));
