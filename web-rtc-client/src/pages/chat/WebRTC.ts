import { EventEmitter } from "./web-rtc/EventEmitter";
import io from "socket.io-client";
import { socket } from "../../socket/socket";

enum SOCKET_EVENTS {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}
interface RTCPeerConnectionConfig {
  iceServers: { urls: string }[];
}

interface WebRTCPeerConnectionConfig extends RTCPeerConnectionConfig {
  socket: {
    url: string;
    options: {
      path: string;
    };
  };
}

class RTCCall extends EventEmitter {
  constructor(
    private id: string,
    private webRTC: WebRTC,
    private options: { _stream: MediaStream }
  ) {
    super();
    this.sendOffer();
  }

  async sendOffer() {
    // const connection = new RTCPeerConnection(this.webRTC.rtcConfiguration);

    console.log("making call");
    for (const track of this.options._stream.getTracks()) {
      console.log("adding track: ", { track });
      this.webRTC.peerConnection.addTrack(track, this.options._stream);
    }

    const offer = await this.webRTC.peerConnection.createOffer();
    await this.webRTC.peerConnection.setLocalDescription(offer);
    const from = this.webRTC.socket.id;

    this.webRTC.socket.emit("video:offer", { offer, from, to: this.id });

    this.webRTC.peerConnection.ontrack = ({ streams }: any) => {
      console.log("streams: ", streams);
      this.emit("stream", { stream: streams[0] });
    };
  }
}

class WebRTC extends EventEmitter {
  peerConnection;
  socket: SocketIOClient.Socket;
  rtcConfiguration: RTCPeerConnectionConfig;

  constructor(config: WebRTCPeerConnectionConfig) {
    super();
    const { socket, ...rtcConfiguration } = config;
    this.rtcConfiguration = rtcConfiguration;

    this.peerConnection = new RTCPeerConnection(rtcConfiguration);
    this.socket = io(socket.url, socket.options);

    this.socket.on(SOCKET_EVENTS.CONNECT, (s: any) => {
      this.emit(SOCKET_EVENTS.CONNECT, this.socket);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      this.emit(SOCKET_EVENTS.DISCONNECT, this.socket);
    });

    this.socket.on("video:answer", async ({ answer, to, from }: any) => {
      console.log("got answer: ", { answer, to, from });
      await this.peerConnection.setRemoteDescription(answer);
    });

    this.socket.on("video:offer", async ({ offer, from }: any) => {
      console.log("got offer", offer);

      await this.peerConnection.setRemoteDescription(offer);
      const thisOn = this.on;
      this.emit("call", {
        // TODO: "on"
        on: thisOn,
        answer: async (stream: any) => {
          console.log("got call");
          for (const track of stream.getTracks()) {
            console.log("adding tracks: ", { track });
            this.peerConnection.addTrack(track, stream);
          }
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);

          console.log("sending answer: ", {
            answer,
            to: from,
            from: this.socket.id,
          });
          this.socket.emit("video:answer", {
            from: this.socket.id,
            to: from,
            answer,
          });
        },
      });
    });

    this.socket.on("onicecandidate", ({ candidate }: any) => {
      console.log("got candidate: ", { candidate });
      this.peerConnection.addIceCandidate(candidate);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  call(id: string, stream: MediaStream, options: any = {}) {
    options._stream = stream;

    this.peerConnection.onicecandidate = ({ candidate }: any) => {
      if (candidate) {
        console.log("sending candidate: ", { candidate });
        socket.emit("onicecandidate", {
          candidate,
          to: id,
          from: this.socket.id,
        });
      }
    };

    const call = new RTCCall(id, this, options);
    return call;
  }
}

export { WebRTC };
export type { RTCPeerConnectionConfig };
