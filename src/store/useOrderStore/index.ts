import { create } from 'zustand';

import { OrderActions, OrderStore } from './types';

const initialState: OrderStore = {
  newOrder: null,
  orders: [],
};

const initialActions: OrderActions = {
  addOrder: () => {},
  deleteOrder: () => {},
  initOrders: () => {},
  setNewOrder: () => {},
};

export const useOrderStore = create<OrderStore & OrderActions>((set) => ({
  ...initialState,
  ...initialActions,

  initOrders: () =>
    set((state) => ({
      ...state,
      ...initialState,
    })),

  addOrder: () =>
    set((state) => ({
      ...state,
      orders: [...state.orders, state.newOrder],
      newOrder: null,
    })),

  setNewOrder: (order) =>
    set(() => ({
      newOrder: order,
    })),

  deleteOrder: (id: string) =>
    set((state) => ({
      ...state,
      orders: [...state.orders.filter((order) => order?.id !== id)],
    })),
}));
