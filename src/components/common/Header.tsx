import { Link} from "react-router-dom";
import ProfileDropdown from "./Profiledropdown";
import { useSession } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [search, setSearch] = useState("")
  const {session} = useSession();
  const navigate = useNavigate();

  return (
    <header className="header shadow-md flex flex-row justify-between py-4 mb-8">
      <div className=" flex flex-row items-center">
        
        <p className="mx-2 my-auto text-xl">
            <Link to={'/'} className="temp-logo"> Hermod</Link>
        </p>
        <form className="mx-2 my-auto" onSubmit={(e) => 
          {
            e.preventDefault();
            if (!search.trim()) return;
            navigate(`/search/${search}`)
            setSearch("")
          }
          }>
          <div className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              type="text" value={search} placeholder="Search" onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
      {session &&
        <div className="flex flex-row items-center">
          <nav>
            <Link className="nav-link flex mx-2 items-center" to="/create-blog">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Write
            </Link>
          </nav>
          <ProfileDropdown session={session}/>
        </div>
        }
    </header>
)};


export default Header;