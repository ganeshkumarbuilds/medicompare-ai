import Hospital from "../models/Hospital.js";
import { calculateDistance } from "../utils/distance.js";
import Service from "../models/Service.js";
import Review from "../models/Review.js";

// Create Hospital
export const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      message: "Hospital created successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Hospitals
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();

    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Hospital
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(
      req.params.id
    );

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Hospital
export const updateHospital = async (req, res) => {
  try {
    const hospital =
      await Hospital.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json({
      message: "Hospital updated",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Hospital
export const deleteHospital = async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Hospital deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const nearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const hospitals = await Hospital.find();

    const results = hospitals.map((hospital) => {
      const distance = calculateDistance(
  Number(latitude),
  Number(longitude),
  hospital.latitude,
  hospital.longitude
);

      return {
        ...hospital.toObject(),
        distance,
      };
    });

    results.sort(
      (a, b) => a.distance - b.distance
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const compareHospitals = async (
  req,
  res
) => {
  try {
    const { hospital1, hospital2 } =
      req.query;

    const firstHospital =
      await Hospital.findById(
        hospital1
      );

    const secondHospital =
      await Hospital.findById(
        hospital2
      );

    if (
      !firstHospital ||
      !secondHospital
    ) {
      return res.status(404).json({
        message:
          "Hospital not found",
      });
    }

    const firstServices =
      await Service.countDocuments({
        hospitalId: hospital1,
      });

    const secondServices =
      await Service.countDocuments({
        hospitalId: hospital2,
      });

    const firstReviews =
      await Review.countDocuments({
        hospitalId: hospital1,
      });

    const secondReviews =
      await Review.countDocuments({
        hospitalId: hospital2,
      });

    res.status(200).json({
      hospital1: {
        ...firstHospital.toObject(),
        servicesCount:
          firstServices,
        reviewsCount:
          firstReviews,
      },

      hospital2: {
        ...secondHospital.toObject(),
        servicesCount:
          secondServices,
        reviewsCount:
          secondReviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};