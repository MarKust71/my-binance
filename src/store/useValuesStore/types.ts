export type Values = {
  [key: string]: number;
};

export type ValuesStore = {
  values: Values;
};

export type ValuesActions = {
  addValue: (value: number) => void;
  clearValues: () => void;
  initValues: () => void;
};
