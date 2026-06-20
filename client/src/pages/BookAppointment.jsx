import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function BookAppointment() {
  const location = useLocation();

  const { hospital, service } = location.state || {};

  const [appointmentDate, setAppointmentDate] =
    useState("");

  const handleBooking = async () => {
    console.log({
  userId: localStorage.getItem("userId"),
  hospitalId: hospital._id,
  serviceId: service._id,
  appointmentDate,
});
    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          userId:
            localStorage.getItem("userId"),
          hospitalId: hospital._id,
          serviceId: service._id,
          appointmentDate,
        }
      );

      alert("Booking Successful");
    } catch (error) {
      console.log(error);
      alert("Booking Failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Book Appointment
      </h1>

      <p>
        <strong>Hospital:</strong>{" "}
        {hospital?.name}
      </p>

      <p className="mb-4">
        <strong>Service:</strong>{" "}
        {service?.serviceName}
      </p>

      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={(e) =>
          setAppointmentDate(
            e.target.value
          )
        }
        className="w-full border p-3 rounded-lg mb-4"
      />

      <button
        onClick={handleBooking}
        className="bg-green-600 text-white px-5 py-3 rounded-lg"
      >
        Confirm Booking
      </button>

    </div>
  );
}

export default BookAppointment;