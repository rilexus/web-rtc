import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LogoutButton } from "./components/logout-button/logout-button";
import { UserList } from "./components/user-list/UserList";
import { socket } from "../../socket/socket";
import { socketConnector } from "../../socket/react-socket-connector/react-socket-connector";
import { useAuthentication } from "../../authentication/hooks/useAuthentication";

const configuration = {
  iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
};

const openMediaDevices = async (constraints: any) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

const connectVideo = (videoRef: any, stream: any) => {
  videoRef.current.srcObject = stream;
};
const emitVideoOffer = (offer: any, from: string, to: string) => {
  console.log("sending offer: ", { offer, to, from });
  socket.emit("video:offer", { offer, from, to });
};

// const webRTC = new WebRTC(configuration);

const peerConnectionRef = { current: new RTCPeerConnection(configuration) };

const _ChatPage = ({ emitVideoOffer }: any) => {
  const [{ username: currentUserName }] = useAuthentication();
  const ownStream = useRef<any>();
  const ownVideoRef = useRef<any>();
  const foreignVideoRef = useRef<any>();

  useLayoutEffect(() => {
    const call = async () => {
      peerConnectionRef.current.ontrack = ({ streams }: any) => {
        console.log("adding stream: ", streams[0]);
        connectVideo(foreignVideoRef, streams[0]);
      };

      ownStream.current = await openMediaDevices({
        video: true,
        audio: true,
      });
      connectVideo(ownVideoRef, ownStream.current);

      for (const track of ownStream.current.getTracks()) {
        peerConnectionRef.current.addTrack(track, ownStream.current);
      }

      socket.on("onicecandidate", ({ candidate }: any) => {
        console.log("got candidate: ", { candidate });
        peerConnectionRef.current.addIceCandidate(candidate);
      });

      socket.on("video:answer", async ({ answer, to, from }: any) => {
        console.log("got answer: ", { answer, to, from });
        await peerConnectionRef.current.setRemoteDescription(answer);
      });

      socket.on("video:offer", async ({ offer, to, from }: any) => {
        console.log("got offer: ", { offer, to, from });
        await peerConnectionRef.current.setRemoteDescription(offer);

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        console.log("sending answer: ", { answer, to: from, from: to });
        socket.emit("video:answer", { answer, to: from, from: to });
      });
    };
    call();
  }, []);

  const onVideo = async (name: string) => {
    // await webRTC.call(name, currentUserName, ownStream.current);
    // webRTC.on("stream", ({ streams }) => {
    //   connectVideo(foreignVideoRef, streams[0]);
    // });

    const from = currentUserName;
    const to = name;
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // emitVideoOffer(offer, from, to);
    socket.emit("video:offer", { offer, from, to });

    peerConnectionRef.current.onicecandidate = ({ candidate }: any) => {
      if (candidate) {
        console.log("sending candidate: ", { candidate });
        socket.emit("onicecandidate", {
          candidate,
          to,
          from,
        });
      }
    };
  };

  const onAudio = (name: string) => {};

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
const ChatPage = socketConnector((dispatch) => {
  return {
    emitVideoOffer: (offer: any, from: string, to: string) =>
      dispatch({ type: "video:offer", offer, from, to }),
  };
})(_ChatPage);
export { ChatPage };
