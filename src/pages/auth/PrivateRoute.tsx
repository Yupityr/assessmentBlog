import React from "react";
import { useSession  } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

type Props = {children: React.ReactNode;};

const Privateroute = ({ children }: Props) => {
  const { session } = useSession();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{session ? <>{children}</> : <Navigate to="/signup" />}</div>;
};

export default Privateroute;
