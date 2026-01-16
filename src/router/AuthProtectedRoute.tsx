import { Navigate, Outlet } from "react-router-dom";
import { useSession as UserAuth } from "@/context/AuthContext";

const Authprotectedroute = () => {
  const { session } = UserAuth();
  if (!session) {
    // or you can redirect to a different page and show a message
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default Authprotectedroute;
