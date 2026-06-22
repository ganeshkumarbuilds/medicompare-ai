import express from "express";

import {
  getAdminStats,
  hospitalRatings,
  recentBookings,
  generateServices,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);

router.get(
  "/hospital-ratings",
  hospitalRatings
);

router.get(
  "/recent-bookings",
  recentBookings
);

router.post(
  "/generate-services",
  generateServices
);

export default router;