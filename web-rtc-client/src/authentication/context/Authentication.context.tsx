import React from "react";
import { createContext } from "react";
import {
  AuthenticationDispatch,
  AuthenticationType,
} from "../types/Authentication.type";
import { defaultAuthentication } from "./default-context-value";

const AuthValueContext = createContext<AuthenticationType>({
  ...defaultAuthentication,
});

const AuthDispatchContext = createContext<AuthenticationDispatch>(() => {});

const ValueProvider: any = AuthValueContext.Provider;
ValueProvider.displayName = "ValueProvider";

const DispatchProvider: any = AuthDispatchContext.Provider;
DispatchProvider.displayName = "DispatchProvider";

export {
  ValueProvider,
  DispatchProvider,
  AuthValueContext,
  AuthDispatchContext,
};
