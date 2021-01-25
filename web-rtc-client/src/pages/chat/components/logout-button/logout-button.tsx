import React from "react";
import { useAuthentication } from "../../../../authentication/hooks/useAuthentication";
import { Button } from "../../../../components/buttons/Button";
import { socket } from "../../../../socket/socket";
import { AuthenticationActionTypes } from "../../../../authentication/types/Authentication.action-type";

const LogoutButton = () => {
  const [{ username }, dispatch] = useAuthentication();
  return (
    <Button
      onClick={() => {
        socket.emit("logout", { payload: { username } });
        dispatch({ type: AuthenticationActionTypes.logout });
      }}
    />
  );
};

export { LogoutButton };
