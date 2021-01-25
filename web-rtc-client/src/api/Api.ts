import { API_PREFIX, IS_IN_DEVELOPMENT, SERVER_ADDRESS } from "../evn";

import { HttpService } from "./http/Http.service";
import { AuthenticationService } from "../authentication/Authentication.service";

class Api {
  constructor(private authService: AuthenticationService) {}

  async login(name: string, password: string) {
    return this.authService.login(name, password);
  }

  async logout(username: string) {
    return this.authService.logout(username);
  }
}

const DEVELOPMENT_ADDRESS = `http://localhost:${process.env.REACT_APP_PORT}/${API_PREFIX}`;
const PROD_ADDRESS = `${SERVER_ADDRESS}/${API_PREFIX}`;

const http = new HttpService({
  path: `${IS_IN_DEVELOPMENT ? DEVELOPMENT_ADDRESS : PROD_ADDRESS}`,
});
const authService = new AuthenticationService(http);

const api = new Api(authService);
export { api };
