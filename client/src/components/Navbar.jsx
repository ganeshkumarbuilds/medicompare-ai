import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isLoggedIn = !!user;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center h-16">

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            MediCompare AI
          </Link>

          <div className="flex items-center gap-5">

            <Link
              to="/"
              className="font-medium hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/hospitals"
              className="font-medium hover:text-blue-600"
            >
              Hospitals
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/nearby-hospitals"
                  className="font-medium hover:text-blue-600"
                >
                  Nearby
                </Link>

                <Link
                  to="/compare"
                  className="font-medium hover:text-blue-600"
                >
                  Compare
                </Link>

                <Link
                  to="/map"
                  className="font-medium hover:text-blue-600"
                >
                  Map
                </Link>

                <Link
                  to="/bookings"
                  className="font-medium hover:text-blue-600"
                >
                  My Bookings
                </Link>

                <Link
                  to="/ai-chat"
                  className="font-medium hover:text-blue-600"
                >
                  AI Chat
                </Link>

                <Link
                  to="/advisor"
                  className="font-medium hover:text-blue-600"
                >
                  AI Advisor
                </Link>
              </>
            )}

            {user?.role === "hospitalAdmin" && (
              <Link
                to="/admin"
                className="font-medium text-purple-600 hover:text-purple-800"
              >
                Admin
              </Link>
            )}

            {user && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                <span className="text-xl">
                  👋
                </span>

                <span className="font-semibold text-gray-700">
                  Welcome {user.name}
                </span>
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
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