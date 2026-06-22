import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState("rating");

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    filterHospitals();
  }, [search, sortBy, hospitals]);

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/hospitals"
      );

      setHospitals(data);
      setFilteredHospitals(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterHospitals = () => {
    let filtered = [...hospitals];

    if (search) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          hospital.city
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    if (sortBy === "rating") {
      filtered.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
    }

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    setFilteredHospitals(filtered);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading hospitals...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-gray-900">
            🏥 Hospitals
          </h1>

          <p className="text-gray-600 mt-3">
            Discover, compare and choose
            the best healthcare providers.
          </p>

        </div>

        {/* Search + Sort */}

        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search hospital or city..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 border rounded-xl p-3"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="rating">
              Sort By Rating
            </option>

            <option value="name">
              Sort By Name
            </option>

          </select>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-3xl font-bold text-blue-600">
              {filteredHospitals.length}
            </h2>

            <p className="text-gray-500">
              Hospitals Found
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-3xl font-bold text-green-600">
              AI
            </h2>

            <p className="text-gray-500">
              Recommendations
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-3xl font-bold text-purple-600">
              Reviews
            </h2>

            <p className="text-gray-500">
              Verified Ratings
            </p>
          </div>

        </div>

        {/* Hospital Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredHospitals.map(
            (hospital) => (
              <div
                key={hospital._id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >

                <img
                  src={
                    hospital.image ||
                    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000"
                  }
                  alt={hospital.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <h2 className="text-2xl font-bold">
                      {hospital.name}
                    </h2>

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ {hospital.rating}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2">

                    <p className="text-gray-600">
                      📍 {hospital.city}
                    </p>

                    <p className="text-gray-600">
                      🏛️ {hospital.state}
                    </p>

                  </div>

                  <Link
                    to={`/hospitals/${hospital._id}`}
                    className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Hospitals;