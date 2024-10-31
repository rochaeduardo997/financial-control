export type TMethods = 'get' | 'post' | 'put' | 'delete';

interface IHttp {
  addRoute(method: TMethods, url: string, callback: Function): void;
  init(): void;
  listen(): void;
}

export default IHttp;
