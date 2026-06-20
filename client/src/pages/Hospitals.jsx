import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading hospitals...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Hospitals
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            className="bg-white rounded-xl shadow-lg p-6 border"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {hospital.name}
            </h2>

            <p className="text-gray-600">
              📍 {hospital.city}
            </p>

            <p className="text-gray-600">
              🏛️ {hospital.state}
            </p>

            <p className="mt-2">
              ⭐ {hospital.rating}
            </p>

            <div className="mt-4">
              <Link
  to={`/hospitals/${hospital._id}`}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block"
>
  View Details
</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hospitals;