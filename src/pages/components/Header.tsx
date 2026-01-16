import { Link} from "react-router-dom";

const Header = () => {
  return (
    <header className="shadow-md flex flex-row justify-between py-4 mb-8">
      <div className=" flex flex-row content-center">
        
        <p className="mx-2 my-auto text-xl">
            <Link to={'/'} className="!text-black"> Hermod</Link>
        </p>
        {/* <form className="mx-2 my-auto" action="">
          <div className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Search"
            />
          </div>
        </form> */}
      </div>
    </header>
)};


export default Header;