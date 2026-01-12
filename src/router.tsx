import {createBrowserRouter} from "react-router-dom";
import Signup from "./pages/auth/Singup";
import Signin from "./pages/auth/Signin";
import Homepage from "./pages/Homepage";
// import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
// import App from "./App";

export const router = createBrowserRouter([
    {path: "/", element: <Homepage/>},
    {path: "/signup", element: <Signup/>},
    {path: "/signin", element: <Signin/>},

]);