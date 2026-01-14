import { Link, Navigate } from "react-router-dom";
import { useSession } from "@/context/AuthContext";


const Landingpage = () => {
    const {session} = useSession();
    if (session) return <Navigate to={'/home'} />
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Welcome to Hermod</h1>
            <p className="text-center mt-4">Your personal blog platform</p>
            <Link to="/signin">
                <button className="mt-6 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 block mx-auto">
                    Get Started
                </button>
            </Link>
        </>
    );
};

export default Landingpage;