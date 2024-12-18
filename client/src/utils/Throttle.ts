export default class Throttle {
  private wait: boolean;
  private callbacks: Set<string>;

  constructor(private delay: number) {
    this.wait = false;
    this.callbacks = new Set<string>();
  }

  async execute(callback: Function, ...args: any) {
    const containsCallback = this.callbacks.has(callback.name);
    if (this.wait && containsCallback) return;
    this.wait = true;
    this.callbacks.add(callback.name);
    await callback(...args);
    setTimeout(() => {
      this.wait = false;
      this.callbacks.delete(callback.name);
    }, this.delay);
  }

  isWaiting() {
    return this.wait;
  }
}
