import { useEffect, useRef } from "react";
import { socket } from "../socket";

function useSubscription(type: string, callback: (...args: any) => void) {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    const handle = (...args: any) => {
      callback(...args);
    };
    socket.on(type, handle);
    return () => {
      socket.removeEventListener(type, handle);
    };
  }, [type, ref]);
}
export { useSubscription };
