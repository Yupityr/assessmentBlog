import { supabase } from "@/services/supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfileDropdown = ({session}: any) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();   
    const toggleDropdown = () => {
        setOpen(!open);
    }
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
        <div>
            <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-300 focus:outline-none"
            >
                <img
                    src="https://wxlokatxrwhwpyvgcpre.supabase.co/storage/v1/object/public/blogBucket/output-onlinepngtools.png"
                    alt="Profile"
                    className="h-9 w-9 rounded-full border"
                />
            </div>
        {open && 
            <div className="relative">
                <div className="dropdown absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border">
                
                    {/* User info (optional) */}
                    <div className="px-4 py-3">
                        <p className="text-sm font-semibold">sample</p>
                        <p className="text-xs text-gray-500">{session?.user.email || "None"}</p>
                    </div>

                    <div className="h-px bg-gray-200" />

                {/* Menu Items */}
                    <div className="py-2">
                        <Link to={`/user/${session?.user.id}`} onClick={toggleDropdown} className="block px-4 py-2 text-sm text-gray-700 " >
                        Profile
                        </Link>
                        {/* <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        Settings
                        </a> */}

                        <div className="h-px bg-gray-200 my-2" />

                        <div 
                        className="w-full text-left px-4 py-2 text-sm text-red-600  cursor-pointer hover:text-blue-700"
                        onClick={signOutUser}
                        >
                        Sign out
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};
export default ProfileDropdown;