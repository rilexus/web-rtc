import React, { ReactNode } from "react";
import { socket } from "../socket";

type Action = { type: string; [key: string]: any } | Function;

function socketConnector(
  socketInstanceMapper: (dispatch: (action: Action) => void) => void
) {
  const dispatch = (action: Action) => {
    if (typeof action === "function") {
      action(dispatch);
    } else {
      return new Promise((resolve, rej) => {
        try {
          const { type, ...rest } = action;
          socket.emit(
            type,
            {
              ...rest,
            },
            resolve
          );
        } catch (e) {
          rej(e);
        }
      });
    }
  };

  const mappedSocket = socketInstanceMapper(dispatch);

  const WithSocket: any = (Component: any) => {
    WithSocket.displayName = `withSocket(${
      Component.displayName || "Component"
    })`;
    return (props: any) => <Component {...props} {...mappedSocket} />;
  };

  return WithSocket;
}

export { socketConnector };
