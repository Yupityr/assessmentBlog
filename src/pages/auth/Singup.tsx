import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useSession } from "@/context/AuthContext";

const SignUpPage = () => {
  const { session } = useSession();
  if (session) return <Navigate to="/" />;
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating account...");
    const { error } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };

  return (
    // <main className="text-center ">
    //   <Link className="home-link" to="/">
    //     ◄ Home
    //   </Link>
    //   <form className="main-container flex flex-col" onSubmit={handleSubmit}>
    //     <h1 className="header-text">Sign Up</h1>
    //     <input
    //       name="email"
    //       onChange={handleInputChange}
    //       type="email"
    //       placeholder="Email"
    //     />
    //     <input
    //       name="password"
    //       onChange={handleInputChange}
    //       type="password"
    //       placeholder="Password"
    //     />
    //     <button type="submit">Create Account</button>
    //     <Link className="auth-link" to="/Signin">
    //       Already have an account? Sign In
    //     </Link>
    //     {status && <p>{status}</p>}
    //   </form>
    // </main>
    <div>
      <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Sign up today!</h2>
        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
        <div className="flex flex-col py-4">
          <input
            onChange={handleInputChange}
            className="p-3 mt-2"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col py-4">
          <input
            onChange={handleInputChange}
            className="p-3 mt-2"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="w-full mt-4">Sign Up</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;
