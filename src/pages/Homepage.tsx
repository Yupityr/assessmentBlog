import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useSession } from "@/context/AuthContext";

const Homepage = () => {
  const { session } = useSession();
  return (
    <main className="flex flex-col items-center justify-center  py-2">
      <section className="main-container">
        <h1 className="header-text">Welcome to Ymir Blog</h1>
        <p>Current User : {session?.user.email || "None"}</p>
        {session ? (
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
        <Link to="/create-blog">Create a Blog</Link>
        <div id="divider"></div>
      </section>
    </main>
  );
};

export default Homepage;
