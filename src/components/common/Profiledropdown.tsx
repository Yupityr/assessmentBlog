import { supabase } from "@/services/supabaseClient";
import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const ProfileDropdown = ({session}: any) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(false)
    const navigate = useNavigate();   
    const toggleDropdown = () => {
        setOpen(!open);
    }
    const signOutUser = async (e:any) => {
        e.preventDefault();
        setStatus(true)
        try{
        await supabase.auth.signOut();
        setStatus(false)
        navigate("/")
        } catch (error){
        return error
        }
    }
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div ref={dropdownRef}>
            <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-300 focus:outline-none"
            >
                <img
                    src=""
                    alt="Profile"
                    className="h-9 w-9 rounded-full border"
                />
            </div>
        {open && 
            <div className="relative">
                <div className="dropdown shadow-2xl absolute right-0 mt-2 w-52 overflow-hidden rounded-xl">
                
                    <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-600">{session?.user.user_metadata.display_name}</p>
                        <p className="text-xs  text-gray-600">{session?.user.email || "None"}</p>
                    </div>

                    <div className="py-2">
                        <div 
                        className="w-full text-left px-4 py-2 text-sm   cursor-pointer hover:text-gray-900 text-gray-600"
                        onClick={() => {
                            toggleDropdown();
                            navigate(`/user/${session?.user.id}`);
                        }}
                        >
                        Profile
                        </div>
                        <div 
                        className="w-full text-left px-4 py-2 text-sm   cursor-pointer hover:text-gray-900 text-gray-600"
                        onClick={() => {
                            toggleDropdown();
                            navigate("/account");
                        }}
                        >
                        Settings
                        </div>


                        <div 
                        className="w-full text-left px-4 py-2 text-sm   cursor-pointer hover:text-gray-900 text-gray-600"
                        onClick={signOutUser}
                        >
                        Sign out
                        </div>
                    </div>
                </div>
            </div>}
            {status && 
                (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div>
                        <Loader />
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProfileDropdown;