class HttpService {
  constructor(private readonly options: { path: string }) {}

  async post(url: string, data: any): Promise<any> {
    return fetch(`${this.options.path}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
export { HttpService };
