import { useState } from 'react';

import { useOrderStore } from 'store/useOrderStore';
import { Order } from 'store/useOrderStore/types';
import { useValuesStore } from 'store/useValuesStore';

export const useLocalStorage = () => {
  const { orders, setNewOrder, addOrder, initOrders } = useOrderStore();
  const { values } = useValuesStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setIsLoading(() => true);

    const data = localStorage.getItem('orders');

    if (data) {
      setIsLoaded(() => true);

      const parsedData = await JSON.parse(data);

      initOrders();

      parsedData.forEach((order: Order) => {
        setNewOrder(order);
        addOrder();
      });
    }

    setIsLoading(() => false);
  };

  const saveOrders = () => {
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  const saveValues = () => {
    localStorage.setItem('values', JSON.stringify(values));
  };

  return {
    isLoaded,
    isLoading,
    loadOrders,
    saveOrders,
    saveValues,
  };
};
