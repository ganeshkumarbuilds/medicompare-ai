import Hospital from "../models/Hospital.js";

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