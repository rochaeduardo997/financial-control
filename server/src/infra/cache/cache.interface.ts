interface ICache {
  connect(): Promise<void>;

  get(key: string): Promise<string>;
  set(key: string, value: string, expiresIn?: number): Promise<boolean>;
  deleteBy(key: string): Promise<boolean>;

  listGet(key: string): Promise<string[]>;
  listSet(key: string, value: string, expiresIn?: number): Promise<boolean>;
  listDeleteBy(key: string, value: string): Promise<boolean>;
  listDeleteAllBy(key: string): Promise<boolean>;
}

export default ICache;
