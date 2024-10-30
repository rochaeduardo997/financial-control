import ICache from "./cache.interface";
import {createClient, RedisClientType} from 'redis';

class RedisAdapter implements ICache {
  private client: RedisClientType;

  constructor(){
    const username = process.env.CACHE_USER;
    const password = process.env.CACHE_PASSWORD;
    const host     = process.env.CACHE_HOST;
    const port     = process.env.CACHE_PORT;
    const url = `redis://${username}:${password}@${host}:${port}`;

    this.client = createClient({ url });
  }

  async connect(): Promise<void>{
    this.client.on('error', err => console.log('Redis Client Error', err));
    await this.client.connect();
    return;
  }

  async get(key: string): Promise<string> {
    try{
      return await this.client.get(key) || '';
    }catch(err: any){
      throw new Error(`failed on redis get by key ${key}`);
    }
  }

  async set(key: string, value: string, expiresIn?: number): Promise<boolean> {
    try{
      await this.client.set(key, value, { EX: expiresIn });
      return true;
    }catch(err: any){
      throw new Error(`failed on redis set by key ${key}`);
    }
  }

  async deleteBy(key: string): Promise<boolean> {
    try{
      await this.client.del(key);
      return true;
    }catch(err: any){
      throw new Error(`failed on redis delete by key ${key}`);
    }
  }

  async listGet(key: string): Promise<string[]> {
    try{
      return await this.client.lRange(key, 0, -1);
    }catch(err: any){
      throw new Error(`failed on redis list get by key ${key}`);
    }
  }

  async listSet(key: string, value: string, expiresIn?: number): Promise<boolean> {
    try{
      await this.client.rPush(key, value);
      return true;
    }catch(err: any){
      throw new Error(`failed on redis list set by key ${key}`);
    }
  }

  async listDeleteBy(key: string, value: string): Promise<boolean> {
    try{
      await this.client.lRem(key, 1, value);
      return true;
    }catch(err: any){
      throw new Error(`failed on redis list remove by key ${key}`);
    }
  }

  async listDeleteAllBy(key: string): Promise<boolean> {
    try{
      await this.client.del(key);
      return true;
    }catch(err: any){
      throw new Error(`failed on redis list remove by key ${key}`);
    }
  }
}

export default RedisAdapter;
