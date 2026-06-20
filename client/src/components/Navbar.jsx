import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("userId") !== null;

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/");
    window.location.reload();
  };

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
              className="text-gray-800 font-semibold hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/hospitals"
              className="text-gray-800 font-semibold hover:text-blue-600"
            >
              Hospitals
            </Link>

            <Link
              to="/nearby-hospitals"
              className="text-gray-800 font-semibold hover:text-blue-600"
            >
              Nearby
            </Link>

            <Link
              to="/compare"
              className="text-gray-800 font-semibold hover:text-blue-600"
            >
              Compare
            </Link>

            <Link
  to="/bookings"
  className="text-gray-800 font-semibold hover:text-blue-600"
>
  My Bookings
</Link>
<Link
  to="/admin"
  className="text-gray-800 font-semibold hover:text-blue-600"
>
  Admin
</Link>

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;