import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import Homepage from "../pages/Homepage";
import PrivateRoute from "@/pages/auth/PrivateRoute";
import { Createpost } from "@/pages/Createpost";
import Layout from "@/pages/Layout";
import AuthProtectedRoute from "./AuthProtectedRoute";
import Landingpage from "@/pages/Landingpage";
import Viewpost from "@/pages/Viewpost";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Layout/>,
        children: [
            {path: "/", element: <Landingpage/>},
            {path: "/signup", element: <Signup/>},
            {path: "/signin", element: <Signin/>},
            {
                path: "/", 
                element: (
                <PrivateRoute>
                    <AuthProtectedRoute/>
                </PrivateRoute>
            ),
                children: [
                    {
                        path: "/home", 
                        element: <Homepage />
                    },
                    {
                        path: "/create-blog", 
                        element: <Createpost/>
                    },
                    {
                        path: "/post/:postId", 
                        element: <Viewpost/>
                    }
                ]
            },
            
        ]    
    },
    {path: "*", element: <div>404 Not Found</div>},
    

]);