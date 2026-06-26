import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  IndianRupee,
  Clock,
  Trophy,
  Building2,
} from "lucide-react";

function Compare() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] =
    useState("");

  const [comparison, setComparison] = useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/services`
      );
      console.log(data);

      const uniqueServices = [
        ...new Set(
          data.map(
            (service) =>
              service.serviceName
          )
        ),
      ];

      setServices(uniqueServices);
    } catch (err) {
      console.log(err);
    }
  };

  const compareServices = async () => {
    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/services/compare?service=${selectedService}`
);

console.log("COMPARE API RESPONSE");
console.log(data);

setComparison(data);

      const sorted = [...data].sort(
        (a, b) => a.price - b.price
      );

      setComparison(sorted);
    } catch (err) {
      console.log(err);
      alert("Unable to compare services");
    }

    setLoading(false);
  };

  const cheapest =
    comparison.length > 0
      ? comparison.reduce((a, b) =>
          a.price < b.price ? a : b
        )
      : null;

  const bestHospital = useMemo(() => {
    if (!comparison.length) return null;

    let best = comparison[0];
    let bestScore = 0;

    comparison.forEach((hospital) => {
      const score =
        hospital.rating * 20 -
        hospital.price / 500 -
        hospital.duration / 20;

      if (score > bestScore) {
        bestScore = score;
        best = hospital;
      }
    });

    return best;
  }, [comparison]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-xl">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <h1 className="text-5xl font-black">
            💰 Compare Service Prices
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Compare prices,
            ratings,
            duration and choose
            the best hospital.
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search Card */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Search
              className="text-blue-600"
              size={28}
            />

            <h2 className="text-3xl font-bold">
              Search Service
            </h2>

          </div>

          <div className="flex flex-col md:flex-row gap-4">

            <select
              value={selectedService}
              onChange={(e) =>
                setSelectedService(
                  e.target.value
                )
              }
              className="flex-1 border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            >
              <option value="">
                Select Service
              </option>

              {services.map((service) => (
                <option
                  key={service}
                  value={service}
                >
                  {service}
                </option>
              ))}
            </select>

            <button
              onClick={
                compareServices
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition cursor-pointer text-white font-bold rounded-2xl px-10 py-4"
            >
              {loading
                ? "Comparing..."
                : "Compare"}
            </button>

          </div>

        </div>

        {/* Results */}

        {comparison.length > 0 && (

          <>
            <div className="grid lg:grid-cols-3 gap-6">

              {comparison.map((hospital, index) => {
                console.log(hospital.hospitalId);
  console.log(hospital);

  return (
                  <div
                    key={index}
                    className={`rounded-3xl shadow-xl p-6 bg-white border-4 transition hover:-translate-y-2 ${
                      cheapest?.hospitalName ===
                      hospital.hospitalName
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <div className="flex items-center gap-2">

                          <Building2
                            className="text-blue-600"
                          />

                          <h2 className="text-2xl font-black">
                            {hospital.hospitalName}
                          </h2>

                        </div>

                        <p className="text-gray-500 mt-2">
                          {hospital.serviceName}
                        </p>

                      </div>

                      {cheapest?.hospitalName ===
                        hospital.hospitalName && (

                        <div className="bg-green-500 text-white text-xs px-3 py-2 rounded-full font-bold">
                          Cheapest
                        </div>

                      )}

                    </div>

                    <div className="mt-6 space-y-4">

                      <div className="flex items-center gap-3">

                        <Star
                          className="text-yellow-500"
                        />

                        <span className="font-semibold">
                          {hospital.rating}
                          /5
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <IndianRupee
                          className="text-green-600"
                        />

                        <span className="text-2xl font-black text-green-600">
                          ₹{hospital.price}
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <Clock
                          className="text-indigo-600"
                        />

                        <span>
                          {hospital.duration}
                          mins
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <MapPin
                          className="text-red-500"
                        />

                        <span>
                          {hospital.city}
                        </span>

                      </div>
                                          </div>

                    <div className="mt-8">
                      <Link
  to={`/hospitals/${hospital.hospitalId}`}
  state={{
    selectedService: hospital.serviceName,
  }}
  onClick={() => {
    console.log("Clicked Hospital:", hospital);
    console.log("Hospital ID:", hospital.hospitalId);
  }}
  className="block text-center bg-blue-600 hover:bg-blue-700 transition text-white font-bold rounded-2xl py-3"
>
  Book Appointment
</Link>

                    </div>

                  </div>

                );
              })}

            </div>

            {/* AI Recommendation */}

            {bestHospital && (

              <div className="mt-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl text-white p-8">

                <div className="flex items-center gap-3 mb-5">

                  <Trophy size={34} />

                  <h2 className="text-3xl font-black">
                    AI Recommendation
                  </h2>

                </div>

                <h3 className="text-2xl font-bold">
                  🏥 {bestHospital.hospitalName}
                </h3>

                <div className="grid md:grid-cols-3 gap-5 mt-6">

                  <div className="bg-white/20 rounded-2xl p-5">

                    <h4 className="font-bold mb-2">
                      💰 Price
                    </h4>

                    <p className="text-2xl font-black">
                      ₹{bestHospital.price}
                    </p>

                  </div>

                  <div className="bg-white/20 rounded-2xl p-5">

                    <h4 className="font-bold mb-2">
                      ⭐ Rating
                    </h4>

                    <p className="text-2xl font-black">
                      {bestHospital.rating}/5
                    </p>

                  </div>

                  <div className="bg-white/20 rounded-2xl p-5">

                    <h4 className="font-bold mb-2">
                      ⏱ Duration
                    </h4>

                    <p className="text-2xl font-black">
                      {bestHospital.duration} mins
                    </p>

                  </div>

                </div>

                <div className="mt-8 bg-white text-gray-800 rounded-2xl p-6">

                  <h3 className="text-xl font-black mb-4">
                    Why this hospital?
                  </h3>

                  <ul className="space-y-3">

                    <li>
                      ✅ Best overall value considering
                      price, rating and duration.
                    </li>

                    <li>
                      💰 Lowest available price is
                      highlighted automatically.
                    </li>

                    <li>
                      ⭐ Highly rated hospital with
                      reliable service.
                    </li>

                    <li>
                      ⚡ Faster service duration
                      improves recommendation score.
                    </li>

                  </ul>

                </div>

              </div>

            )}

            {/* Summary */}

            <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">

              <h2 className="text-3xl font-black mb-6">
                📊 Comparison Summary
              </h2>

              <div className="grid md:grid-cols-4 gap-6">

                <div className="bg-blue-50 rounded-2xl p-6 text-center">

                  <h3 className="text-gray-500">
                    Hospitals Compared
                  </h3>

                  <p className="text-4xl font-black text-blue-700 mt-2">
                    {comparison.length}
                  </p>

                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center">

                  <h3 className="text-gray-500">
                    Lowest Price
                  </h3>

                  <p className="text-4xl font-black text-green-700 mt-2">
                    ₹{cheapest?.price}
                  </p>

                </div>

                <div className="bg-yellow-50 rounded-2xl p-6 text-center">

                  <h3 className="text-gray-500">
                    Best Rating
                  </h3>

                  <p className="text-4xl font-black text-yellow-600 mt-2">
                    {Math.max(
                      ...comparison.map(
                        (item) => item.rating
                      )
                    )}
                  </p>

                </div>

                <div className="bg-purple-50 rounded-2xl p-6 text-center">

                  <h3 className="text-gray-500">
                    Fastest Service
                  </h3>

                  <p className="text-4xl font-black text-purple-700 mt-2">
                    {Math.min(
                      ...comparison.map(
                        (item) => item.duration
                      )
                    )} min
                  </p>

                </div>

              </div>

            </div>

          </>

        )}

      </div>

    </div>

  );
}

export default Compare;