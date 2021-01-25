import { useContext } from "react";
import {
  AuthenticationDispatch,
  AuthenticationType,
} from "../types/Authentication.type";
import {
  AuthDispatchContext,
  AuthValueContext,
} from "../context/Authentication.context";

const useAuthentication = (): [AuthenticationType, AuthenticationDispatch] => {
  return [
    useContext<AuthenticationType>(AuthValueContext),
    useContext<AuthenticationDispatch>(AuthDispatchContext),
  ];
};
export { useAuthentication };
