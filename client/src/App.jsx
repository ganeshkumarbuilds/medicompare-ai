import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NearbyHospitals from "./pages/NearbyHospitals";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import BookAppointment from "./pages/BookAppointment";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import AddHospital from "./pages/AddHospital";
import AddService from "./pages/AddService";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:id" element={<HospitalDetails />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-hospital" element={<AddHospital />} />
        <Route path="/admin/add-service" element={<AddService />} />
      </Routes>
    </>
  );
}
export default App;