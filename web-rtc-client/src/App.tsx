import React, { useEffect } from "react";
import { socketConnector } from "./socket/react-socket-connector/react-socket-connector";
import { Switch, Route } from "react-router-dom";
import { LoginPage } from "./pages/login/Login.page";
import { useHistory } from "react-router-dom";
import { PAGES } from "./pages/pages";
import { WebRTCChat } from "./pages/web-rtc-chat/WebRTCChat";
import { useAuthentication } from "./authentication/hooks/useAuthentication";

function App(props: any) {
  const [{ isLoggedIn }, dispatch] = useAuthentication();
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push(PAGES.chat.path);
    } else {
      history.push(PAGES.login.path);
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <div>
        <Switch>
          <Route path={PAGES.login.path}>
            <LoginPage />
          </Route>
          <Route path={PAGES.chat.path}>
            <WebRTCChat />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

const AppWithSocket = socketConnector((dispatch: any) => ({
  sendEvents: () => {
    dispatch({ type: "events", payload: { data: "fromApp" } });
  },
}))(App);

export default AppWithSocket;
