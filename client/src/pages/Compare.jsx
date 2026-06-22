import { useEffect, useState } from "react";
import axios from "axios";

function Compare() {
  const [hospitals, setHospitals] = useState([]);
  const [hospital1, setHospital1] = useState("");
  const [hospital2, setHospital2] = useState("");
  const [comparison, setComparison] = useState(null);

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
    }
  };

  const compareHospitals = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/hospitals/compare?hospital1=${hospital1}&hospital2=${hospital2}`
      );

      setComparison(data);
    } catch (error) {
      console.log(error);
      alert("Comparison failed");
    }
  };
  let recommendedHospital = null;

if (comparison) {
  const score1 =
    comparison.hospital1.rating * 10 +
    comparison.hospital1.servicesCount +
    comparison.hospital1.reviewsCount;

  const score2 =
    comparison.hospital2.rating * 10 +
    comparison.hospital2.servicesCount +
    comparison.hospital2.reviewsCount;

  recommendedHospital =
    score1 > score2
      ? comparison.hospital1
      : comparison.hospital2;
}

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        Compare Hospitals
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <select
          value={hospital1}
          onChange={(e) =>
            setHospital1(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">
            Select Hospital 1
          </option>

          {hospitals.map((hospital) => (
            <option
              key={hospital._id}
              value={hospital._id}
            >
              {hospital.name}
            </option>
          ))}
        </select>

        <select
          value={hospital2}
          onChange={(e) =>
            setHospital2(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">
            Select Hospital 2
          </option>

          {hospitals.map((hospital) => (
            <option
              key={hospital._id}
              value={hospital._id}
            >
              {hospital.name}
            </option>
          ))}
        </select>

      </div>

      <button
        onClick={compareHospitals}
        className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg"
      >
        Compare
      </button>

      {comparison && (
        <div className="mt-10 bg-white shadow rounded-xl p-6">

          <table className="w-full border">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">
                  Feature
                </th>

                <th className="p-3 border">
                  {comparison.hospital1.name}
                </th>

                <th className="p-3 border">
                  {comparison.hospital2.name}
                </th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td className="border p-3">
                  Rating
                </td>

                <td className="border p-3">
                  {comparison.hospital1.rating}
                </td>

                <td className="border p-3">
                  {comparison.hospital2.rating}
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  City
                </td>

                <td className="border p-3">
                  {comparison.hospital1.city}
                </td>

                <td className="border p-3">
                  {comparison.hospital2.city}
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  Services
                </td>

                <td className="border p-3">
                  {
                    comparison.hospital1
                      .servicesCount
                  }
                </td>

                <td className="border p-3">
                  {
                    comparison.hospital2
                      .servicesCount
                  }
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  Reviews
                </td>

                <td className="border p-3">
                  {
                    comparison.hospital1
                      .reviewsCount
                  }
                </td>

                <td className="border p-3">
                  {
                    comparison.hospital2
                      .reviewsCount
                  }
                </td>
              </tr>

            </tbody>

          </table>
          {recommendedHospital && (
  <div className="mt-8 bg-green-50 border border-green-300 rounded-xl p-6">
    <h2 className="text-2xl font-bold text-green-700">
      🏆 AI Recommendation
    </h2>

    <p className="mt-3 text-lg">
      Recommended Hospital:
      <span className="font-bold">
        {" "}
        {recommendedHospital.name}
      </span>
    </p>

    <p className="mt-2 text-gray-700">
      Based on rating, services, and reviews.
    </p>
  </div>
)}

        </div>
      )}

    </div>
  );
}

export default Compare;