import { Link, Navigate } from "react-router-dom";
import { useSession } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to <html> on change
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
    >
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

const Landingpage = () => {
    const {session} = useSession();
    if (session) return <Navigate to={'/home'} />
    return (
        <>
            {/* <h1 className="text-3xl font-bold text-center">Welcome to Hermod</h1>
            <p className="text-center mt-4">Your personal blog platform</p>
            <Link to="/signin">
                <button className="mt-6 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 block mx-auto">
                    Get Started
                </button>
            </Link> */}
            <div>
            <button className="flex justify-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            </button>
                
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen text-3xl">
                <h1>I miss you</h1>
            </div>
        </>
    );
};

export default Landingpage;