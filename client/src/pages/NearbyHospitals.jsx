import { useState } from "react";
import axios from "axios";

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const findNearbyHospitals = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const { data } = await axios.get(
            `http://localhost:5000/api/hospitals/nearby/search?latitude=${latitude}&longitude=${longitude}`
          );

          setHospitals(data);
        } catch (error) {
          console.log(error);
        }

        setLoading(false);
      },
      (error) => {
        console.log(error);
        alert("Please allow location access");
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Nearby Hospitals
      </h1>

      <button
        onClick={findNearbyHospitals}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        📍 Find Nearby Hospitals
      </button>

      {loading && (
        <p className="mt-4">Loading...</p>
      )}

      <div className="mt-6 grid gap-4">
        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            className="bg-white shadow rounded-lg p-4"
          >
            <h2 className="text-xl font-semibold">
              {hospital.name}
            </h2>

            <p>{hospital.city}</p>

            <p>
              ⭐ {hospital.rating}
            </p>

            <p>
              📍 {hospital.distance.toFixed(2)} km
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyHospitals;