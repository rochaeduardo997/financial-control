import ICache from "./cache.interface";

class CacheFake implements ICache {
  private REGISTERS: { [t in string]: any } = {};

  async connect(): Promise<void> {}

  async get(key: string): Promise<string> {
    return this.REGISTERS[key];
  }

  async set(key: string, value: string, expiresIn?: number): Promise<boolean> {
    this.REGISTERS[key] = value;
    return true;
  }

  async deleteBy(key: string): Promise<boolean> {
    delete this.REGISTERS[key];
    return true;
  }

  async listSet(key: string, value: string, expiresIn?: number): Promise<boolean> {
    if(!Array.isArray(this.REGISTERS[key])) this.REGISTERS[key] = [];
    this.REGISTERS[key].push(value);
    return true;
  }

  async listGet(key: string): Promise<string[]> {
    return this.REGISTERS[key];
  }

  async listDeleteBy(key: string, value: string): Promise<boolean> {
    if(!Array.isArray(this.REGISTERS[key])) this.REGISTERS[key] = [];
    const index = this.REGISTERS[key].findIndex((r: string) => r === value);
    this.REGISTERS[key].splice(index, 1)
    return true;
  }

  async listDeleteAllBy(key: string): Promise<boolean> {
    delete this.REGISTERS[key];
    return true;
  }
}

export default CacheFake;
