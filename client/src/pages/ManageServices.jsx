import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services`
      );

      setServices(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (id) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/services/${id}`
    );

    alert("Service deleted");

    fetchServices();
  } catch (error) {
    console.log(error);
  }
};

  const filteredServices = services.filter(
    (service) =>
      service.serviceName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      service.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              🩺 Manage Services
            </h1>

            <p className="text-gray-500 mt-2">
              View, edit and delete services
            </p>
          </div>

          <Link
            to="/admin/add-service"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 cursor-pointer rounded-xl"
          >
            ➕ Add Service
          </Link>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-5 mb-6">

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-4">
                  Service
                </th>

                <th className="text-left p-4">
                  Category
                </th>

                <th className="text-left p-4">
                  Price
                </th>

                <th className="text-left p-4">
                  Duration
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredServices.map(
                (service) => (
                  <tr
                    key={service._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold">
                      {service.serviceName}
                    </td>

                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {service.category}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-green-600">
                      ₹{service.price}
                    </td>

                    <td className="p-4">
                      {service.duration} mins
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/admin/edit-service/${service._id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 cursor-pointer rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteService(
                              service._id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 cursor-pointer rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default ManageServices;