import React, { useState } from "react";
import { LabeledInput } from "../../../components/labeled-input/LabeledInput";
import { useAuthentication } from "../../../authentication/hooks/useAuthentication";
import { AuthenticationActionTypes } from "../../../authentication/types/Authentication.action-type";

const LoginInput = () => {
  const [_, dispatch] = useAuthentication();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = (name: string, password: string) => {
    if (name /* && password */) {
      dispatch({
        type: AuthenticationActionTypes.login,
        payload: { name, password },
      });
    }
  };

  const handleLogin = () => {
    login(name, password);
  };

  return (
    <div>
      <LabeledInput
        placeholder={"Name"}
        value={name}
        type={"text"}
        label={"Name"}
        id={"nameInput"}
        onChange={(event) => setName(event.target.value)}
      />
      <LabeledInput
        placeholder={"Password"}
        value={password}
        type={"password"}
        label={"Password"}
        id={"passwordInput"}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export { LoginInput };
