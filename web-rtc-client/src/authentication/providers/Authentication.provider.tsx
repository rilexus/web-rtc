import { useLocalStorage } from "../../hooks/use-local-storage/useLocalStorage";
import { api } from "../../api/Api";
import React from "react";
import {
  DispatchProvider,
  ValueProvider,
} from "../context/Authentication.context";
import { AuthenticationType } from "../types/Authentication.type";
import {
  AuthenticationActions,
  AuthenticationActionTypes,
  LoginAction,
  LogoutAction,
} from "../types/Authentication.action-type";
import { defaultAuthentication } from "../context/default-context-value";
import { HttpStatus } from "../../api/http/HttpStatus.enum";
// import { HttpException } from "../../api/http/Http.exception";

const AuthenticationProvider = ({ children }: any) => {
  const [auth, setValue, remove] = useLocalStorage<AuthenticationType>(
    "login",
    {
      ...defaultAuthentication,
    }
  );

  const isAuthenticated = (): boolean => {
    return false;
  };

  const login = async (username: string, password: string) => {
    // socketLogin(name, password).then((res: any) => {
    //   console.log(res);
    //   setValue((val) => ({ ...val, isLoggedIn: true, name: name }));
    // });
    const res = await api.login(username, password);
    if (res.statusCode === HttpStatus.FORBIDDEN) {
      // TODO: implement error handling
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      return;
    }
    setValue((v) => ({ ...v, isLoggedIn: true, username: username }));
  };

  const logout = () => {
    setValue((val) => ({ ...val, isLoggedIn: false, username: "", key: "" }));
  };

  const dispatch = (action: AuthenticationActions) => {
    const _switch = {
      [AuthenticationActionTypes.login]: (action: LoginAction) =>
        login(action.payload.name, action.payload.password),
      [AuthenticationActionTypes.logout]: (action: LogoutAction) => logout(),
    };
    // @ts-ignore
    _switch[action.type]?.(action);
  };

  return (
    <ValueProvider value={auth}>
      <DispatchProvider value={dispatch}>{children}</DispatchProvider>
    </ValueProvider>
  );
};

export { AuthenticationProvider };
