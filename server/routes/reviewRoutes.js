import express from "express";

import {
  createReview,
  getHospitalReviews,
  getAverageRating,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);

router.get(
  "/hospital/:hospitalId",
  getHospitalReviews
);

router.get(
  "/hospital/:hospitalId/rating",
  getAverageRating
);

router.delete("/:id", deleteReview);

export default router;