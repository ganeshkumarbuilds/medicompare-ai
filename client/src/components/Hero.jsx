import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              AI Powered Medicine Comparison
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mt-6 leading-tight">
              Compare Medicines
              <span className="text-blue-600"> Instantly</span>
            </h1>

            <p className="text-lg text-gray-600 mt-6">
              Upload a prescription and discover cheaper generic
              alternatives, compare prices, and save money using AI.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/compare"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Start Comparing
              </Link>

              <Link
                to="/register"
                className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">

              <h3 className="font-bold text-xl mb-6">
                Sample Comparison
              </h3>

              <div className="space-y-4">

                <div className="border rounded-xl p-4">
                  <p className="font-semibold">
                    Paracetamol 650mg
                  </p>
                  <p className="text-red-500">
                    ₹120
                  </p>
                </div>

                <div className="border rounded-xl p-4 bg-green-50">
                  <p className="font-semibold">
                    Generic Alternative
                  </p>
                  <p className="text-green-600">
                    ₹75
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-semibold">
                    Total Savings
                  </p>
                  <p className="text-blue-600 text-2xl font-bold">
                    ₹45
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;