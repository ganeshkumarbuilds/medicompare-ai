import {
  Activity,
  IndianRupee,
  Search,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Overview of your medicine comparisons.
          </p>
        </div>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <Activity
              className="text-blue-600 mb-3"
              size={35}
            />

            <h3 className="text-gray-500">
              Comparisons
            </h3>

            <p className="text-3xl font-bold">
              128
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <IndianRupee
              className="text-green-600 mb-3"
              size={35}
            />

            <h3 className="text-gray-500">
              Money Saved
            </h3>

            <p className="text-3xl font-bold">
              ₹12,540
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <Search
              className="text-purple-600 mb-3"
              size={35}
            />

            <h3 className="text-gray-500">
              Searches
            </h3>

            <p className="text-3xl font-bold">
              342
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <TrendingUp
              className="text-orange-600 mb-3"
              size={35}
            />

            <h3 className="text-gray-500">
              Savings Rate
            </h3>

            <p className="text-3xl font-bold">
              37%
            </p>
          </div>

        </div>

        {/* Recent Searches */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Recent Searches
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span>Paracetamol 650mg</span>
              <span className="text-green-600">
                Saved ₹45
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Azithromycin 500mg</span>
              <span className="text-green-600">
                Saved ₹80
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Dolo 650</span>
              <span className="text-green-600">
                Saved ₹35
              </span>
            </div>

            <div className="flex justify-between">
              <span>Cetirizine</span>
              <span className="text-green-600">
                Saved ₹25
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;