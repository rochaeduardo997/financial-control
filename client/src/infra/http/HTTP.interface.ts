interface IHTTP {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
  put(url: string, body: any): Promise<any>;
  delete(url: string): Promise<any>;
  raw(config: any): Promise<any>;
}

export default IHTTP;
