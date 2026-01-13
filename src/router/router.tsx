import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import Homepage from "../pages/Homepage";
import PrivateRoute from "@/pages/auth/PrivateRoute";
import { Createpost } from "@/pages/Createpost";
import Layout from "@/pages/Layout";
import AuthProtectedRoute from "./AuthProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Layout/>,
        children: [
            {path: "/", element: <Signin/>},
            {path: "/signup", element: <Signup/>},
            {path: "/signin", element: <Signin/>},
            {
                path: "/", 
                element: <AuthProtectedRoute/>,
                children: [
                    {
                        path: "/home", 
                        element: (
                            <PrivateRoute>
                                <Homepage />
                            </PrivateRoute>
                        )
                    },
                    {
                        path: "/create-blog", 
                        element: (
                            <PrivateRoute>
                                <Createpost/>
                            </PrivateRoute>
                        )
                    }
                ]
            },
            
        ]    
    },
    {path: "*", element: <div>404 Not Found</div>},
    

]);