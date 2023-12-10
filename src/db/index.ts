import { IndexedDBProps } from 'react-indexed-db-hook';

export const indexedDBConfig: IndexedDBProps = {
  name: 'my-binance',
  version: 1,
  objectStoresMeta: [
    {
      store: 'ticks',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        // { name: 'name', keypath: 'name', options: { unique: false } },
        // { name: 'email', keypath: 'email', options: { unique: false } },
      ],
    },
  ],
};
