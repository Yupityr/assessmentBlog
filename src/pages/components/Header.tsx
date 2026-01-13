import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">
            <Link to="/"> Hermod</Link>
        </h1>
      </div>
    </header>
)};


export default Header;