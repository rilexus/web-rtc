import {AuthenticationActions} from "./Authentication.action-type";

type AuthenticationType = { isLoggedIn: boolean; key: string; username: string }
type AuthenticationDispatch = (
  action: AuthenticationActions | ((action: AuthenticationActions) => void)
) => void;

export type { AuthenticationType, AuthenticationDispatch };