export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
}

export type Order = null | {
  amount: number;
  btc: number;
  id: string;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  time: string;
  timestamp: number;
  type: OrderType;
};

export type OrderStore = {
  newOrder: Order | null;
  orders: Order[];
};

export type OrderActions = {
  addOrder: () => void;
  deleteOrder: (id: string) => void;
  initOrders: () => void;
  setNewOrder: (order: Order) => void;
};
