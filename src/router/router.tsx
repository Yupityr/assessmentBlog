import {createBrowserRouter} from "react-router-dom";
import Signup from "../pages/auth/Singup";
import Signin from "../pages/auth/Signin";
import Homepage from "../pages/Homepage";
import Createpost from "@/pages/Createpost";
import Layout from "@/pages/Layout";
import Authprotectedroute from "./Authprotectedroute";
import Landingpage from "@/pages/Landingpage";
import Viewpost from "@/pages/Viewpost";
import Updatepost from "@/pages/Updatepost";
import Userposts from "@/pages/Userposts";
import Privateroute from "@/pages/auth/Privateroute";

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
                <Privateroute>
                    <Authprotectedroute/>
                </Privateroute>
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
                        path: "/post/user/:userId", 
                        element: <Userposts/>
                    },
                    {
                        path: "/post/:postId", 
                        element: <Viewpost/>
                    },
                    {
                        path:"/post/edit/:postId",
                        element: <Updatepost/>
                    }
                ]
            },
            
        ]    
    },
    {path: "*", element: <div>404 Not Found</div>},
    

]);