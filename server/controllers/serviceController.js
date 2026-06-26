import Service from "../models/Service.js";

export const createService = async (req, res) => {
  try {
    console.log("Incoming Service Data:");
    console.log(req.body);

    const service = await Service.create(req.body);

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.log("SERVICE ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("hospitalId", "name city");

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    ).populate("hospitalId");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchServices = async (req, res) => {
  try {
    const { service } = req.query;

    const results = await Service.find({
      serviceName: {
        $regex: service,
        $options: "i",
      },
    }).populate("hospitalId");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const compareServices = async (req, res) => {
  try {
    const { service } = req.query;

    const results = await Service.find({
      serviceName: {
        $regex: service,
        $options: "i",
      },
    }).populate("hospitalId");

    const comparison = results
  .filter(item => item.hospitalId)
  .map(item => ({
    hospitalId: item.hospitalId._id.toString(),
    hospitalName: item.hospitalId.name,
    city: item.hospitalId.city,
    rating: item.hospitalId.rating,
    serviceName: item.serviceName,
    price: item.price,
    duration: item.duration,
  }));

    comparison.sort((a, b) => a.price - b.price);

    res.status(200).json(comparison);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteService = async (
  req,
  res
) => {
  try {
    await Service.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Service deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};