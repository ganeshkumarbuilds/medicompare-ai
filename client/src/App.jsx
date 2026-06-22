import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NearbyHospitals from "./pages/NearbyHospitals";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import BookAppointment from "./pages/BookAppointment";
import Bookings from "./pages/Bookings";

import AdminDashboard from "./pages/AdminDashboard";
import AddHospital from "./pages/AddHospital";
import AddService from "./pages/AddService";
import ManageHospitals from "./pages/ManageHospitals";
import EditHospital from "./pages/EditHospital";
import ManageServices from "./pages/ManageServices";
import EditService from "./pages/EditService";

import AIAdvisor from "./pages/AIAdvisor";
import AIChat from "./pages/AIChat";
import HospitalMap from "./pages/HospitalMap";

import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return user?.role === "hospitalAdmin"
    ? children
    : <Navigate to="/" />;
}

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/hospitals"
          element={<Hospitals />}
        />

        <Route
          path="/hospitals/:id"
          element={<HospitalDetails />}
        />

        {/* User Routes */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/compare"
          element={
            <PrivateRoute>
              <Compare />
            </PrivateRoute>
          }
        />

        <Route
          path="/nearby-hospitals"
          element={
            <PrivateRoute>
              <NearbyHospitals />
            </PrivateRoute>
          }
        />

        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookAppointment />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <Bookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/advisor"
          element={
            <PrivateRoute>
              <AIAdvisor />
            </PrivateRoute>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <PrivateRoute>
              <AIChat />
            </PrivateRoute>
          }
        />

        <Route
          path="/map"
          element={
            <PrivateRoute>
              <HospitalMap />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-hospital"
          element={
            <AdminRoute>
              <AddHospital />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/manage-hospitals"
          element={
            <AdminRoute>
              <ManageHospitals />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-hospital/:id"
          element={
            <AdminRoute>
              <EditHospital />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-service"
          element={
            <AdminRoute>
              <AddService />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/manage-services"
          element={
            <AdminRoute>
              <ManageServices />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-service/:id"
          element={
            <AdminRoute>
              <EditService />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;