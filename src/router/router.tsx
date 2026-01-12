import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import App from "../App";
import Homepage from "../pages/Homepage";
import PrivateRoute from "@/pages/auth/PrivateRoute";
import { Createpost } from "@/pages/Createpost";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/signup", element: <Signup/>},
    {path: "/signin", element: <Signin/>},
    {path: "/home", element: (
            <PrivateRoute>
                <Homepage />
            </PrivateRoute>
    )},
    {
        path: "/create-blog",
        element: (
            <PrivateRoute>
                <Createpost/>
            </PrivateRoute>
    )},
    {path: "*", element: <div>404 Not Found</div>},
    

]);