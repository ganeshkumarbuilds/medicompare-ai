import { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bookings"
      );

      const userBookings = data.filter(
        (booking) =>
          booking.userId?._id === userId
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No bookings found
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-2xl font-semibold">
                {
                  booking.hospitalId?.name
                }
              </h2>

              <p className="mt-2">
                Service:
                {" "}
                {
                  booking.serviceId
                    ?.serviceName
                }
              </p>

              <p>
                Date:
                {" "}
                {new Date(
                  booking.appointmentDate
                ).toLocaleString()}
              </p>

              <p className="mt-2 font-semibold">
                Status:
                {" "}
                <span className="text-blue-600">
                  {booking.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;