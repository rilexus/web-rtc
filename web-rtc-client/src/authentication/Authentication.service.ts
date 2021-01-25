import { HttpService } from "../api/http/Http.service";

const AUTHENTICATION_ENDPOINT = "authentication";

const PATHS = {
  LOGIN: `/${AUTHENTICATION_ENDPOINT}/login`,
  LOGOUT: `/${AUTHENTICATION_ENDPOINT}/logout`,
};
class AuthenticationService {
  constructor(private readonly httpService: HttpService) {}

  async login(name: string, password: string) {
    return this.httpService
      .post(PATHS.LOGIN, {
        username: name,
        password,
      })
      .then((res) => res.json());
  }

  async logout(username: string) {
    return this.httpService.post(PATHS.LOGOUT, {
      username,
    });
  }
}

export { AuthenticationService };
