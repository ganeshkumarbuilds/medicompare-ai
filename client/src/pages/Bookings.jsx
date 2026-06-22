import { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userId = user?._id;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bookings"
      );

      const userBookings =
        data.filter(
          (booking) =>
            booking.userId?._id ===
            userId
        );

      setBookings(userBookings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            📅 My Bookings
          </h1>

          <p className="text-gray-500 mt-2">
            View your appointment
            history
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow">

            <h2 className="text-xl font-semibold">
              No bookings found
            </h2>

            <p className="text-gray-500 mt-2">
              Book a hospital service
              to see it here.
            </p>

          </div>
        ) : (
          <div className="grid gap-5">

            {bookings.map(
              (booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow p-6"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {
                          booking
                            .hospitalId
                            ?.name
                        }
                      </h2>

                      <p className="mt-2 text-gray-600">
                        🩺{" "}
                        {
                          booking
                            .serviceId
                            ?.serviceName
                        }
                      </p>

                      <p className="mt-2 text-gray-600">
                        📅{" "}
                        {new Date(
                          booking.appointmentDate
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          booking.status ===
                          "Approved"
                            ? "bg-green-100 text-green-700"
                            : booking.status ===
                              "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {
                          booking.status
                        }
                      </span>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Bookings;