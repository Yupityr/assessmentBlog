import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "@/context/AuthContext";
import { supabase } from "@/services/supabaseClient";

const Signin = () => {
  const { session } = useSession();
  if (session) return <Navigate to="/home" />;
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const isDisabled = !formValues.email || !formValues.password;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };
  return (
    <div>
      <form onSubmit={handleSignin} className="max-w-md m-auto pt-24">
        <h2 className="text-center font-bold pb-2">Sign in to Hermod</h2>
        <div className="flex flex-col py-4">
          <input
            className="p-3 mt-2"
            name="email"
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col py-4">
          <input
            className="p-3 mt-2"
            name="password"
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <button disabled={isDisabled} type="submit" className="w-full mt-4">Sign In</button>
        <p className="text-center pt-4">
          <Link to="/signup">Create new account</Link>
        </p>
        {status && <p className="text-center">{status}</p>}
      </form>
    </div>
  );
}

export default Signin;