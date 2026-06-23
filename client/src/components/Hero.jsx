import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">

      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}

          <div>

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
            🏥 AI Powered Hospital Comparison Platform
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight">
              Compare & Choose
              <span className="block text-yellow-300">
                The Best Hospital
              </span>
            </h1>

            <p className="text-xl mt-6 text-blue-100">
              Compare hospitals, services, prices,
              ratings and reviews. Get AI-powered
              recommendations and book appointments
              instantly.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                to="/hospitals"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
              >
                🏥 Explore Hospitals
              </Link>

              <Link
                to="/advisor"
                className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
              >
                🤖 AI Advisor
              </Link>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">

              <div>
                <h3 className="text-4xl font-bold">
                  52+
                </h3>

                <p className="text-blue-100">
                  Hospitals
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold">
                  454+
                </h3>

                <p className="text-blue-100">
                  Services
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold">
                  AI
                </h3>

                <p className="text-blue-100">
                  Recommendations
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg">

              <h3 className="text-2xl font-bold mb-6">
                🏆 Top Hospital Snapshot
              </h3>

              <div className="space-y-4">

                <div className="border rounded-xl p-4">

                  <div className="flex justify-between">

                    <span className="font-semibold">
                      Apollo Hospital
                    </span>

                    <span className="text-yellow-500">
                      ⭐ 4.8
                    </span>

                  </div>

                  <p className="text-gray-500 mt-2">
                    Hyderabad
                  </p>

                </div>

                <div className="border rounded-xl p-4">

                  <div className="flex justify-between">

                    <span className="font-semibold">
                      Yashoda Hospital
                    </span>

                    <span className="text-yellow-500">
                      ⭐ 4.9
                    </span>

                  </div>

                  <p className="text-gray-500 mt-2">
                    Hyderabad
                  </p>

                </div>

                <div className="bg-green-50 rounded-xl p-4">

                  <h4 className="font-bold text-green-700">
                    🤖 AI Recommendation
                  </h4>

                  <p className="mt-2 text-gray-700">
                    Based on ratings, patient reviews,
service quality and pricing,
Yashoda Hospital offers the best
overall value.
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