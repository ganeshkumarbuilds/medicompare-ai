import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function BookAppointment() {
  const location = useLocation();

  const { hospital, service } = location.state || {};

  const [appointmentDate, setAppointmentDate] =
    useState("");

    const handleBooking = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!appointmentDate) {
      alert("Please select date & time");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/bookings",
      {
        userId: user._id,
        hospitalId: hospital._id,
        serviceId: service._id,
        appointmentDate,
      }
    );

    alert("✅ Booking Successful");

    window.location.href =
      "/bookings";
  } catch (error) {
    console.log(error);
    alert("Booking Failed");
  }
};

 
  return (
    <div className="min-h-screen bg-gray-100 py-10">
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">

      <h1 className="text-3xl font-bold mb-6">
        Book Appointment
      </h1>
      <div className="bg-blue-50 rounded-2xl p-5 mb-6">

  <h2 className="text-2xl font-bold mb-4">
    Appointment Summary
  </h2>

  <p className="mb-2">
    🏥 <strong>Hospital:</strong>{" "}
    {hospital?.name}
  </p>

  <p className="mb-2">
    🩺 <strong>Service:</strong>{" "}
    {service?.serviceName}
  </p>

  <p className="mb-2">
    💰 <strong>Price:</strong> ₹
    {service?.price}
  </p>

  <p>
    ⏱️ <strong>Duration:</strong>{" "}
    {service?.duration} mins
  </p>

</div>

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
        className="bg-green-600 text-white px-5 py-3 cursor-pointer rounded-lg"
      >
        Confirm Booking
      </button>

    </div>
    </div>
  );
}

export default BookAppointment;