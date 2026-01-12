import { Link } from "react-router-dom";
import { supabase } from "@/supabase/supabaseClient";
import { useSession } from "@/context/AuthContext";

const Homepage = () => {
  const { session } = useSession();
  return (
    <main className="flex flex-col items-center justify-center  py-2">
      <section className="main-container">
        <h1 className="header-text">React Supabase Auth Template</h1>
        <p>Current User : {session?.user.email || "None"}</p>
        {session ? (
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        ) : (
          <Link to="/auth/sign-in">Sign In</Link>
        )}
        <Link to="/create-blog">Create a Blog</Link>
        <div id="divider"></div>
      </section>
    </main>
  );
};

export default Homepage;
