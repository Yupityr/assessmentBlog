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

  const isDisabled = !formValues.email || !formValues.password;


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
    <div>
      <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
        <h2 className="text-center font-bold pb-2">Sign up for Hermod</h2>
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
        <button disabled={isDisabled} type="submit" className="w-full mt-4">Sign Up</button>
        <p className="text-center pt-4">
          <Link to="/">Already have an account?</Link>
        </p>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;
