import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            MediCompare AI
          </Link>

          <div className="flex items-center gap-6">

            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/compare"
              className="text-gray-600 hover:text-blue-600"
            >
              Compare
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;