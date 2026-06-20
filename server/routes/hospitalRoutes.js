import express from "express";

import {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  nearbyHospitals
} from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/", createHospital);

router.get("/", getHospitals);

router.get("/nearby/search", nearbyHospitals);

router.get("/:id", getHospitalById);

router.put("/:id", updateHospital);

router.delete("/:id", deleteHospital);

export default router;