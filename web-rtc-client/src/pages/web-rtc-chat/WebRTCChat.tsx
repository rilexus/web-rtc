import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socketConnector } from "../../socket/react-socket-connector/react-socket-connector";
import { UserList } from "../chat/components/user-list/UserList";
import { LogoutButton } from "../chat/components/logout-button/logout-button";
import { SOCKET_ADDRESS, SOCKET_PREFIX } from "../../evn";
import { WebRTC } from "../chat/WebRTC";
import { useAuthentication } from "../../authentication/hooks/useAuthentication";
import SocketIO from "socket.io";

const openMediaDevices = async (constraints: any) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

const connectVideo = (videoRef: any, stream: any) => {
  videoRef.current.srcObject = stream;
};

const _WebRTCChat = ({ emitVideoOffer }: any) => {
  const webRTC = useRef(
    new WebRTC({
      iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
      socket: {
        url: SOCKET_ADDRESS,
        options: {
          path: `/${SOCKET_PREFIX}`,
        },
      },
    })
  );
  const [{ username: currentUserName }] = useAuthentication();
  const ownStream = useRef<any>();
  const ownVideoRef = useRef<any>();
  const foreignVideoRef = useRef<any>();
  const stream = useRef<any>();

  useEffect(() => {
    webRTC.current.on("connect", (socket: SocketIO.Socket) => {
      socket.emit("associate", {
        socketId: socket.id,
        username: currentUserName,
      });
    });
    return () => {
      webRTC.current.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    webRTC.current.on("call", async (call) => {
      stream.current = await openMediaDevices({
        video: true,
        audio: true,
      });

      ownVideoRef.current.srcObject = stream.current;
      call.answer(stream.current);

      // TODO: call.on is not called the function is not implemented
      call.on("stream", function ({ stream }: any) {
        foreignVideoRef.current.srcObject = stream;
      });
    });
  }, []);

  const onVideo = async ({ name, socketId }: any) => {
    stream.current = await openMediaDevices({
      video: true,
      audio: true,
    });
    const call = webRTC.current.call(socketId, stream.current);

    ownVideoRef.current.srcObject = stream.current;

    call.on("stream", ({ stream }) => {
      console.log("got stream: ", stream);
      foreignVideoRef.current.srcObject = stream;
    });
  };

  const onAudio = ({ name, socketId }: any) => {};

  return (
    <div>
      <UserList onAudio={onAudio} onVideo={onVideo} />
      <LogoutButton />
      <div>
        <div>
          <div>local</div>
          <div>
            <video
              id={"ownVideo"}
              ref={ownVideoRef}
              autoPlay
              playsInline
              controls={false}
              style={{
                height: "300px",
                width: "300px",
              }}
            />
          </div>
        </div>
        <div>
          <div>remote</div>
          <div>
            <video
              id={"foreignVideo"}
              ref={foreignVideoRef}
              autoPlay
              playsInline
              controls={false}
              style={{
                height: "300px",
                width: "300px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const WebRTCChat = socketConnector((dispatch) => {
  return {
    emitVideoOffer: (offer: any, from: string, to: string) =>
      dispatch({ type: "video:offer", offer, from, to }),
  };
})(_WebRTCChat);
export { WebRTCChat };
