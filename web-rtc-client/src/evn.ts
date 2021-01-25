const IS_IN_DEVELOPMENT = process.env.NODE_ENV === "development";

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const SOCKET_ADDRESS = `${process.env.REACT_APP_SOCKET_PROTOCOL}://${process.env.REACT_APP_SOCKET_ADDRESS}:${process.env.REACT_APP_SOCKET_PORT}`;

const SERVER_ADDRESS = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}`;
const SOCKET_PREFIX = process.env.REACT_APP_SOCKET_PREFIX;

export {
  SOCKET_ADDRESS,
  SOCKET_PREFIX,
  SERVER_ADDRESS,
  API_PREFIX,
  IS_IN_DEVELOPMENT,
};
