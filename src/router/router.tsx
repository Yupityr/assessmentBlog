import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import App from "../App";
import Homepage from "../pages/Homepage";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PrivateRoute from "@/components/PrivateRoute";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/signup", element: <Signup/>},
    {path: "/signin", element: <Signin/>},
    {path: "/home", element: <Homepage/>},
    {
        path: "/create-blog",
        element: (
            <PrivateRoute>
                <SimpleEditor/>
            </PrivateRoute>
    )},
    {path: "*", element: <div>404 Not Found</div>},
    

]);