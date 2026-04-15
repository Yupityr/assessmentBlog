import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useSession } from "@/context/AuthContext";
import { Eye, EyeClosed } from 'lucide-react';

// ── sub-components ────────────────────────────────────────────────────────────

const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <EyeClosed size={16} />
    ) : (
      <Eye size={16}/>
    );

// ── page ──────────────────────────────────────────────────────────────────────

const SignInPage = () => {
  const { session } = useSession();

  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // all hooks called above — safe to early-return now
  if (session) return <Navigate to="/home" />;

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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your Hermod account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-sm">
          <form onSubmit={handleSignin} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                Email address
              </label>
              <input
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                type="email"
                name="email"
                id="email"
                placeholder="jane@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  onChange={handleInputChange}
                  className="w-full p-3 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={isDisabled}
              type="submit"
              className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {status || "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;