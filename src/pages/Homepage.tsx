import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useSession } from "@/context/AuthContext";
import Blogcard from "./components/Blogcard";


const Homepage = () => {
  const { session} = useSession();
  const navigate = useNavigate();
  
  const signOutUser = async (e:any) => {
    e.preventDefault();

    try{
      await supabase.auth.signOut();
      navigate("/")
    } catch (error){
      return error
    }
  }

  return (
    <main className="flex flex-col items-center justify-center  py-2">
      <section className="main-container">
        <h1 className="header-text my-2 text-center">Welcome to Hermod</h1>
        <p className="text-center">
          Current User : 
          <Link to={`/post/user/${session?.user.id}`}>
            {session?.user.email || "None"}
          </Link>
        </p>
        <div className="flex flex-row justify-center py-5">
          {session ? (
            <button className="flex mx-2 items-center" onClick={signOutUser}>Sign Out</button>
          ) : (
            <Link className="flex mx-2 items-center" to="/signin">Sign In</Link>
          )}
          <Link className="flex mx-2 items-center" to="/create-blog">Create a Blog</Link>
          <div id="divider"></div>
        </div>
      </section>
      <Blogcard />
    </main>
  );
};

export default Homepage;
