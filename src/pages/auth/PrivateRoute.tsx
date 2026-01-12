import React from "react";
import { useSession as UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

type Props = {children: React.ReactNode;};

const PrivateRoute = ({ children }: Props) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{session ? <>{children}</> : <Navigate to="/signup" />}</div>;
};

export default PrivateRoute;
