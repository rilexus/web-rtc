import { useSubscription } from "../../../../../../socket/use-subscription/useSubscription";
import { useEffect, useState } from "react";
import { socket } from "../../../../../../socket/socket";

function useUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit("reloadUserList");
  }, []);

  useSubscription("userListUpdate", ({ list }) => {
    setUsers(list);
  });
  return users;
}

export { useUserList };
