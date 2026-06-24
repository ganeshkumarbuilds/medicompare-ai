import Hospital from "../models/Hospital.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalHospitals =
      await Hospital.countDocuments();

    const totalServices =
      await Service.countDocuments();

    const totalBookings =
      await Booking.countDocuments();

    const totalReviews =
      await Review.countDocuments();

    res.status(200).json({
      totalHospitals,
      totalServices,
      totalBookings,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const hospitalRatings = async (req, res) => {
  try {
    const hospitals = await Hospital.find();

    const data = hospitals.map((hospital) => ({
      name: hospital.name,
      rating: hospital.rating,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const recentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("hospitalId")
      .populate("serviceId")
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
