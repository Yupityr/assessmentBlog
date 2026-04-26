import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import Homepage from "../pages/Homepage";
import Createpost from "@/pages/Createpost";
import Layout from "@/layouts/Layout";
import Authprotectedroute from "./Authprotectedroute";
import Landingpage from "@/pages/Landingpage";
import Viewpost from "@/pages/Viewpost";
import Updatepost from "@/pages/Updatepost";
import Userposts from "@/pages/Userposts";
import Authlayout from "@/layouts/Authlayout";
import ProfileSettings from "@/pages/Profilesettings";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Layout/>,
        children: [
            {index: true, element: <Landingpage/>},
            {
                path: "", 
                element:<Authprotectedroute />,
                children: [
                    {
                        path: "/home", 
                        element: <Homepage />
                    },
                    {
                        path: "/user/:userId", 
                        element: <Userposts/>
                    },
                    {
                        path:"/account",
                        element: <ProfileSettings />
                    }
                ]
            },
    
            {
                path: "/post/:postId", 
                element: <Viewpost/>
            },
        ]    
    },
    {
        path: "/",
        children: [
            {
                path: "/create-blog", 
                element: <Createpost/>
            },
            {
                path:"/post/edit/:postId",
                element: <Updatepost/>
            }
        ]

    },
    {
        element: <Authlayout />,
        children: [
            {path: "/signup", element: <Signup/>},
            {path: "/signin", element: <Signin/>}
        ]
    },
    {path: "*", element: <div>404 Not Found</div>},
    

]);