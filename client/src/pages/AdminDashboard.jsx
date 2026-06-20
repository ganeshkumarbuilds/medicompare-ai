import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Hospitals
          </h2>
          <p className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Services
          </h2>
          <p className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Bookings
          </h2>
          <p className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">
            Reviews
          </h2>
          <p className="text-3xl font-bold">
            0
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Link
          to="/admin/add-hospital"
          className="bg-blue-600 text-white p-6 rounded-xl text-center text-xl font-semibold"
        >
          Add Hospital
        </Link>

        <Link
          to="/admin/add-service"
          className="bg-green-600 text-white p-6 rounded-xl text-center text-xl font-semibold"
        >
          Add Service
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;