import React from "react";

const Button = ({ onClick }: { onClick: (event: any) => void }) => {
  return <button onClick={onClick}>Logout</button>;
};

export { Button };
