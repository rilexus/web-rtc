enum AuthenticationActionTypes {
  login = "login",
  logout = "logout",
}

type LoginAction = {
  type: AuthenticationActionTypes.login;
  payload: { name: string; password: string };
};
type LogoutAction = {
  type: AuthenticationActionTypes.logout;
};

type AuthenticationActions = LoginAction | LogoutAction;

export { AuthenticationActionTypes }
export type {
  AuthenticationActions,
  LogoutAction,
  LoginAction,
};
