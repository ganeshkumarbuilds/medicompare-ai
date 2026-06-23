import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hospitals`
      );

      setHospitals(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHospital = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this hospital?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/hospitals/${id}`
      );

      fetchHospitals();

      alert("Hospital Deleted");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold ">
              🏥 Manage Hospitals
            </h1>

            <p className="text-gray-500 mt-2">
              View, edit and delete hospitals
            </p>
          </div>

          <Link
            to="/admin/add-hospital"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 cursor-pointer rounded-xl"
          >
            ➕ Add Hospital
          </Link>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-5 mb-6">

          <input
            type="text"
            placeholder="Search hospitals..."
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
                  Hospital
                </th>

                <th className="text-left p-4">
                  City
                </th>

                <th className="text-left p-4">
                  State
                </th>

                <th className="text-left p-4">
                  Rating
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredHospitals.map(
                (hospital) => (
                  <tr
                    key={hospital._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4">

  <div className="flex items-center gap-4">

    <img
      src={
        hospital.image ||
        "https://via.placeholder.com/80"
      }
      alt={hospital.name}
      className="w-16 h-16 rounded-xl object-cover"
    />

    <div>

      <p className="font-semibold">
        {hospital.name}
      </p>

      <p className="text-sm text-gray-500">
        {hospital.address}
      </p>

    </div>

  </div>

</td>

                    <td className="p-4">
                      {hospital.city}
                    </td>

                    <td className="p-4">
                      {hospital.state}
                    </td>

                    <td className="p-4">
                      ⭐ {hospital.rating}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/admin/edit-hospital/${hospital._id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 cursor-pointer rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteHospital(
                              hospital._id
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

export default ManageHospitals;