import React from "react";
import { LoginInput } from "./components/LoginInput.component";
import styled from "styled-components";

const Center = styled.div`
  text-align: center;
`;

const LoginPage = () => {
  return (
    <Center>
      <h1>Login</h1>
      <LoginInput />
    </Center>
  );
};

export { LoginPage };
