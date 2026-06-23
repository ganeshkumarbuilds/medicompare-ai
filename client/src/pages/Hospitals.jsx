import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/hospitals"
      );

      setHospitals(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    ...new Set(
      hospitals
        .map((hospital) => hospital.city)
        .filter(Boolean)
    ),
  ];

  const filteredHospitals = hospitals
    .filter((hospital) =>
      hospital.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((hospital) =>
      city ? hospital.city === city : true
    )
    .sort((a, b) => {
      if (sort === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

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

        {/* Search + Filter + Sort */}

        <div className="bg-white rounded-2xl shadow-md p-5 mb-8 grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="🔍 Search Hospital"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-xl p-3"
          />

          <select
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="">
              All Cities
            </option>

            {cities.map((cityName) => (
              <option
                key={cityName}
                value={cityName}
              >
                {cityName}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="border rounded-xl p-3"
          >
            <option value="">
              Sort
            </option>

            <option value="rating">
              Highest Rating
            </option>

            <option value="name">
              A-Z
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
            (hospital, index) => (
              <div
  key={hospital._id}
  className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"

>{index === 0 && (
  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
    🥇 Rank #1
  </div>
)}

{index === 1 && (
  <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
    🥈 Rank #2
  </div>
)}

{index === 2 && (
  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
    🥉 Rank #3
  </div>
)}

{index > 2 && hospital.rating >= 4.5 && (
  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
    ⭐ Top Rated
  </div>
)}
  
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
                      ⭐ {hospital.rating || 0}
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
                    className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
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