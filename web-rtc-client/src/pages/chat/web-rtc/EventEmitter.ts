type Callback = (...args: any) => void;

class EventEmitter {
  listeners: { [event: string]: Callback[] } = {};

  addEventListener(event: string, listener: Callback): void {
    if (typeof listener !== "function") {
      throw new Error("Listener is not a function.");
    }
    if (!this.listeners[event]) {
      // first registration of an event listener
      this.listeners[event] = [listener];
      return;
    }
    this.listeners[event].push(listener);
  }

  removeEventListener(event: string, listener: Callback): void {
    if (this.listeners[event]) {
      // remove listener (callback from array)
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      );
    }
  }

  on(event: string, callback: (...args: any) => void): void {
    this.addEventListener(event, callback);
  }

  emit(event: string, ...args: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => {
        if (typeof listener === "function") {
          listener(...args);
        }
      });
    }
  }
}
export { EventEmitter };
