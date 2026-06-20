import express from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,updateBookingStatus
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/", getBookings);

router.get("/:id", getBookingById);
router.put("/:id", updateBookingStatus);

router.delete("/:id", deleteBooking);

export default router;