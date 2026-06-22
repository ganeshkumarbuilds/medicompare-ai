import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AIAdvisor() {
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState("");
  const [budget, setBudget] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        alert("Location captured");
      },
      (error) => {
        console.log(error);
        alert("Unable to get location");
      }
    );
  };

  const askAI = async () => {
    try {
      if (!treatment || !budget) {
        alert("Enter treatment and budget");
        return;
      }

      if (!latitude || !longitude) {
        alert("Click Use My Location first");
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/ai/recommend",
        {
          treatment,
          budget,
          latitude,
          longitude,
        }
      );

      setResult(data.recommendation);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("AI Recommendation Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8">
          🤖 AI Hospital Advisor
        </h1>

        <div className="space-y-5">

          <div>
            <label className="font-semibold">
              Treatment
            </label>

            <input
              type="text"
              value={treatment}
              onChange={(e) =>
                setTreatment(e.target.value)
              }
              placeholder="MRI Scan"
              className="w-full border p-3 rounded-lg mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Budget (₹)
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              placeholder="4000"
              className="w-full border p-3 rounded-lg mt-2"
            />
          </div>

          <div className="flex gap-4">

            <button
              onClick={getLocation}
              className="bg-green-600 text-white px-6 py-3 cursor-pointer rounded-lg"
            >
              📍 Use My Location
            </button>

            <button
              onClick={askAI}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg"
            >
              {loading
                ? "Thinking..."
                : "Ask AI"}
            </button>

          </div>

        </div>

        {result && (
          <div className="mt-10 bg-blue-50 border rounded-xl p-6">

            <h2 className="text-3xl font-bold mb-5">
              🏆 Recommendation
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Hospital:</strong>{" "}
                {result.hospitalName}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {result.address}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {result.distance}
              </p>

              <p>
                <strong>Rating:</strong>{" "}
                ⭐ {result.rating}
              </p>

              <p>
                <strong>Price:</strong>{" "}
                ₹{result.price}
              </p>

              <div className="bg-white p-4 rounded-lg border">
                <strong>Reason:</strong>
                <p>{result.reason}</p>
              </div>

              <div className="flex gap-4 mt-5">

                <button
                  onClick={() =>
                    navigate(
                      `/hospitals/${result.hospitalId}`
                    )
                  }
                  className="bg-blue-600 text-white px-5 py-3 cursor-pointer rounded-lg"
                >
                  View Hospital
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/hospitals/${result.hospitalId}`
                    )
                  }
                  className="bg-green-600 text-white px-5 py-3 cursor-pointer rounded-lg"
                >
                  Book Appointment
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AIAdvisor;