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

export const generateServices = async (
  req,
  res
) => {
  try {
    const hospitals =
      await Hospital.find();

    const defaultServices = [
      {
        serviceName: "MRI Scan",
        category: "Radiology",
        price: 4500,
        duration: 60,
        description:
          "Magnetic Resonance Imaging scan",
      },
      {
        serviceName: "CT Scan",
        category: "Radiology",
        price: 3500,
        duration: 45,
        description:
          "Computed Tomography scan",
      },
      {
        serviceName: "Blood Test",
        category: "Pathology",
        price: 500,
        duration: 20,
        description:
          "Complete blood examination",
      },
      {
        serviceName: "X-Ray",
        category: "Radiology",
        price: 800,
        duration: 15,
        description:
          "Digital X-Ray imaging",
      },
      {
        serviceName: "Heart Checkup",
        category: "Cardiology",
        price: 3000,
        duration: 60,
        description:
          "Comprehensive cardiac evaluation",
      },
    ];

    let createdCount = 0;

    for (const hospital of hospitals) {
      for (const service of defaultServices) {
        const exists =
          await Service.findOne({
            hospitalId: hospital._id,
            serviceName:
              service.serviceName,
          });

        if (!exists) {
          await Service.create({
            hospitalId:
              hospital._id,
            ...service,
          });

          createdCount++;
        }
      }
    }

    res.status(200).json({
      message:
        "Services generated successfully",
      createdCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};