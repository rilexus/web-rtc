import { SOCKET_ADDRESS, SOCKET_PREFIX } from "../evn";
import io from "socket.io-client";

const socket = io(SOCKET_ADDRESS, { path: `/${SOCKET_PREFIX}` });

export { socket };
