import express from "express";
import {
  askAI,
  recommendHospital,summarizeReviews,compareHospitalsAI,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", askAI);

router.post("/recommend", recommendHospital);
router.post("/review-summary/:hospitalId", summarizeReviews);
router.post("/compare",compareHospitalsAI);

export default router;