import { useState } from "react";
import { Upload, Search } from "lucide-react";
import Navbar from "../components/Navbar";

function Compare() {
  const [medicine, setMedicine] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);

    // Claude API call later

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Compare Medicines
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Find cheaper alternatives and save money.
          </p>
        </div>

        {/* Input Card */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

          <label className="block text-lg font-semibold mb-3">
            Medicine Name
          </label>

          <input
            type="text"
            value={medicine}
            onChange={(e) =>
              setMedicine(e.target.value)
            }
            placeholder="Example: Paracetamol 650mg"
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCompare}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2"
          >
            <Search size={20} />
            {loading
              ? "Analyzing..."
              : "Compare Medicine"}
          </button>
        </div>

        {/* Upload Area */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border-2 border-dashed border-gray-300">

          <div className="flex flex-col items-center">

            <Upload
              size={50}
              className="text-blue-600 mb-4"
            />

            <h3 className="text-xl font-semibold">
              Upload Prescription
            </h3>

            <p className="text-gray-500 mt-2">
              PDF, JPG, PNG supported
            </p>

            <input
              type="file"
              className="mt-6"
            />
          </div>

        </div>

        {/* Result Section */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold text-lg">
              Original Medicine
            </h3>

            <p className="mt-4 text-gray-600">
              Paracetamol 650mg
            </p>

            <p className="text-red-500 text-2xl font-bold mt-2">
              ₹120
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold text-lg">
              Alternative
            </h3>

            <p className="mt-4 text-gray-600">
              Generic Paracetamol
            </p>

            <p className="text-green-500 text-2xl font-bold mt-2">
              ₹75
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow">
            <h3 className="font-bold text-lg">
              Savings
            </h3>

            <p className="text-4xl font-bold mt-4">
              ₹45
            </p>

            <p className="mt-2">
              You save 37%
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Compare;