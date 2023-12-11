export type DbStore = {
  storeDb: IDBDatabase | null;
};

export type DbActions = {
  setStoreDb: (database: IDBDatabase) => void;
};
