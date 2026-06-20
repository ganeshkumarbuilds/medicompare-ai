import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NearbyHospitals from "./pages/NearbyHospitals";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
    </Routes>
  );
}

export default App;