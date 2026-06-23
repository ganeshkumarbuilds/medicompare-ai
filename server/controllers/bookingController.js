import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      message: "Appointment booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("hospitalId", "name city")
      .populate("serviceId", "serviceName price");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    )
      .populate("userId")
      .populate("hospitalId")
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Booking cancelled",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBookingStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const booking =
        await Booking.findByIdAndUpdate(
          req.params.id,
          { status },
          { returnDocument: "after", }
        );

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };