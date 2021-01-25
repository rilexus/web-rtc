class HttpException extends Error {
  constructor(...args:any) {
    super(...args);
  }
}

export { HttpException }