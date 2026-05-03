import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { useSession } from "@/context/AuthContext";
import { Eye, EyeClosed } from 'lucide-react';

const SignUpPage = () => {
  const { session } = useSession();
  if (session) return <Navigate to="/home" />;

  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    !formValues.confirmPassword ||
    formValues.password === formValues.confirmPassword;

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formValues.password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "",
    "#E24B4A",
    "#EF9F27",
    "#1D9E75",
    "#0F6E56",
  ];

  const isDisabled =
    !formValues.email ||
    !formValues.password ||
    !formValues.confirmPassword ||
    !formValues.displayName ||
    formValues.password !== formValues.confirmPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating account...");

    const { data, error } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password,
    });

    if (error) {
      alert(error.message);
      setStatus("");
      return;
    }

    // Write username directly to profiles table.
    // More reliable than reading display_name from a trigger —
    // triggers often only copy the email prefix, not metadata fields.
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          email: formValues.email,
          username: formValues.displayName,
        });

      if (profileError) {
        console.error("[SignUp] Failed to save username to profiles:", profileError.message);
      }
    }

    setStatus("");
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <EyeClosed size={16} />
    ) : (
      <Eye size={16}/>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold ">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join Hermod to get started</p>
        </div>

        {/* Card */}
        <div className="border border-gray-200 rounded-xl p-7 shadow-sm">
          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Display name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-600 mb-1.5">
                Display name
              </label>
              <input
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                type="text"
                name="displayName"
                id="displayName"
                placeholder="Jane Smith"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  onChange={handleInputChange}
                  className="w-full p-3 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Password strength bar */}
              {formValues.password && (
                <div className="mt-2">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: strengthColors[passwordStrength],
                      }}
                    />
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: strengthColors[passwordStrength] }}
                  >
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  onChange={handleInputChange}
                  className={`w-full p-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                    !passwordsMatch
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={isDisabled}
              type="submit"
              className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {status || "Create account"}
            </button>
          </form>

        </div>
        {/* Footer links */}
        <div className="text-center mt-5 space-y-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-sm">
            <Link to="/forgot-password" className="text-gray-400 hover:text-blue-600 transition">
              Forgot your password?
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;