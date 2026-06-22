import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalServices: 0,
    totalBookings: 0,
    totalReviews: 0,
  });

  const [ratingData, setRatingData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRatings();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRatings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/hospital-ratings"
      );

      setRatingData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRecentBookings = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:5000/api/admin/recent-bookings"
    );

    setRecentBookings(data);
  } catch (error) {
    console.log(error);
  }
};

  const overviewData = [
    {
      name: "Hospitals",
      value: stats.totalHospitals,
    },
    {
      name: "Services",
      value: stats.totalServices,
    },
    {
      name: "Bookings",
      value: stats.totalBookings,
    },
    {
      name: "Reviews",
      value: stats.totalReviews,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#a21caf",
  ];
  const generateServices = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/admin/generate-services"
    );

    alert(
      `${data.createdCount} services generated successfully`
    );

    fetchStats();
  } catch (error) {
    console.log(error);
    alert("Failed to generate services");
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            👨‍💼 Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor hospitals, services,
            bookings and reviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              🏥 Hospitals
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalHospitals}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              🩺 Services
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalServices}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              📅 Bookings
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalBookings}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              ⭐ Reviews
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalReviews}
            </h2>
          </div>

        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          {/* Hospital Ratings */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              ⭐ Hospital Ratings
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={ratingData}>
                <XAxis dataKey="name" />

                <YAxis domain={[0, 5]} />

                <Tooltip />

                <Bar
                  dataKey="rating"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Platform Overview */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              📊 Platform Overview
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>

                <Pie
                  data={overviewData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {overviewData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 shadow mb-10">

          <h2 className="text-3xl font-bold mb-5">
            🤖 AI Insights
          </h2>

          <div className="space-y-3 text-lg">

            <p>
              • Apollo Hospital has
              strong patient demand.
            </p>

            <p>
              • MRI services are the
              most frequently searched.
            </p>

            <p>
              • User reviews show
              positive satisfaction.
            </p>

            <p>
              • Continue improving
              service coverage across
              hospitals.
            </p>

          </div>

        </div>

        {/* Top Hospitals */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">

          <h2 className="text-2xl font-bold mb-4">
            🏆 Top Rated Hospitals
          </h2>

          <div className="space-y-3">

            {[...ratingData]
  .sort(
    (a, b) =>
      b.rating - a.rating
  )
  .map((hospital, index) => (
                <div
                  key={hospital.name}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {index + 1}.{" "}
                    {hospital.name}
                  </span>

                  <span>
                    ⭐ {hospital.rating}
                  </span>
                </div>
              ))}

          </div>

        </div>
        {/* Recent Bookings */}

<div className="bg-white rounded-2xl shadow p-6 mb-10">

  <h2 className="text-2xl font-bold mb-5">
    📋 Recent Bookings
  </h2>

  {recentBookings.length === 0 ? (
    <p>No bookings available</p>
  ) : (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">
              Patient
            </th>

            <th className="text-left py-3">
              Hospital
            </th>

            <th className="text-left py-3">
              Service
            </th>

            <th className="text-left py-3">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {recentBookings.map(
            (booking) => (
              <tr
                key={booking._id}
                className="border-b"
              >

                <td className="py-3">
                  {booking.userId?.name}
                </td>

                <td className="py-3">
                  {booking.hospitalId?.name}
                </td>

                <td className="py-3">
                  {booking.serviceId?.serviceName}
                </td>

                <td className="py-3">
                  {new Date(
                    booking.createdAt
                  ).toLocaleDateString()}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  )}

</div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
  onClick={generateServices}
  className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-2xl text-center cursor-pointer text-xl font-semibold"
>
  ⚡ Generate 250 Services
</button>

          <Link
            to="/admin/add-hospital"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl text-center text-xl cursor-pointer font-semibold"
          >
            ➕ Add Hospital
          </Link>

          <Link
            to="/admin/manage-hospitals"
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-2xl text-center text-xl cursor-pointer font-semibold"
          >
            🏥 Manage Hospitals
          </Link>

          <Link
            to="/admin/add-service"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-2xl text-center text-xl cursor-pointer font-semibold"
          >
            ➕ Add Service
          </Link>

          <Link
            to="/admin/manage-services"
            className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-2xl cursor-pointer text-center text-xl font-semibold"
          >
            🩺 Manage Services
          </Link>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;