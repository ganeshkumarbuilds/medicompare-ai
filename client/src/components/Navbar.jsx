import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Bot,
  Shield,
} from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const storedData = JSON.parse(
  localStorage.getItem("user")
);

const user = storedData?.user || storedData;
console.log("storedData =", storedData);
console.log("user =", user);
console.log("role =", user?.role);

  const isLoggedIn = !!user;

  const closeMenu = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            🏥 MediCompare AI
          </Link>

          {/* Desktop Menu */}

          <div className="hidden lg:flex items-center gap-5 cursor-pointer">

            <Link
              to="/"
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/hospitals"
              className="hover:text-blue-600 transition"
            >
              Hospitals
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/nearby-hospitals"
                  className="hover:text-blue-600 transition"
                >
                  Nearby
                </Link>

                <Link
                  to="/compare"
                  className="hover:text-blue-600 transition"
                >
                  Compare
                </Link>

                <Link
                  to="/map"
                  className="hover:text-blue-600 transition"
                >
                  Map
                </Link>

                <Link
                  to="/bookings"
                  className="hover:text-blue-600 transition"
                >
                  Bookings
                </Link>

                <Link
                  to="/ai-chat"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Bot size={18} />
                  AI Chat
                </Link>

                <Link
                  to="/advisor"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  AI Advisor
                </Link>
              </>
            )}
            {user &&
 user.role &&
 user.role.toLowerCase().trim() === "hospitaladmin" && (
  <Link
    to="/admin"
    className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-800"
  >
    <Shield size={18} />
    Admin Panel
  </Link>
)}
            {user && (
              <div className="bg-blue-50 px-3 py-2 rounded-full text-sm font-semibold">
                👤 {user.name}
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="lg:hidden cursor-pointer"
          >
            {open ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="lg:hidden border-t bg-white shadow-lg">

          <div className="flex flex-col p-4">

            <Link
              to="/"
              onClick={closeMenu}
              className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            >
              🏠 Home
            </Link>

            <Link
              to="/hospitals"
              onClick={closeMenu}
              className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            >
              🏥 Hospitals
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/nearby-hospitals"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  📍 Nearby
                </Link>

                <Link
                  to="/compare"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  ⚖️ Compare
                </Link>

                <Link
                  to="/map"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  🗺️ Map
                </Link>

                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  📅 My Bookings
                </Link>

                <Link
                  to="/ai-chat"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  🤖 AI Chat
                </Link>

                <Link
                  to="/advisor"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
                >
                  🧠 AI Advisor
                </Link>
              </>
            )}

            {true && (
  <Link
    to="/admin"
    onClick={closeMenu}
    className="px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
  >
    👨‍💼 Admin Panel
  </Link>
)}

            {user && (
              <div className="mt-3 bg-gray-100 p-3 rounded-lg">
                👤 {user.name}
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="mt-3 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 cursor-pointer transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="mt-3 bg-blue-600 text-white py-3 rounded-lg cursor-pointer text-center hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;