import { create } from 'zustand';

import { DbActions, DbStore } from 'store/useDbStore/types';

const initialState: DbStore = {
  storeDb: null,
};

const initialActions: DbActions = {
  setStoreDb: () => {},
};

export const useDbStore = create<DbStore & DbActions>((set) => ({
  ...initialState,
  ...initialActions,

  setStoreDb: (storeDb: IDBDatabase) => {
    set(() => ({
      storeDb,
    }));
  },
}));
