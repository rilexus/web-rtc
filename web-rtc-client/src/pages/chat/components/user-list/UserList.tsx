import React from "react";
import { useUserList } from "./hooks/use-user-list/useUserList";
import styled from "styled-components";
import { useAuthentication } from "../../../../authentication/hooks/useAuthentication";

const Ul = styled.ul`
  margin: 0;
  padding: 0;
`;

const UserList = ({
  onVideo,
  onAudio,
}: {
  onVideo: (name: string) => void;
  onAudio: (name: string) => void;
}) => {
  const userList = useUserList();
  const [{ username }] = useAuthentication();

  const removeSelf = ({ name }: { name: string }) => name !== username;

  return (
    <div>
      <Ul>
        {userList.filter(removeSelf).map((user: any, idx) => {
          return (
            <li key={`${user.name}-${idx}`}>
              <div>
                <div>
                  <b>{user.name}</b>
                </div>
                <div>{user.socketId}</div>
                <div>
                  <button onClick={() => onVideo(user)}>Video</button>
                  <button onClick={() => onAudio(user)}>Audio</button>
                </div>
              </div>
            </li>
          );
        })}
      </Ul>
    </div>
  );
};

export { UserList };
