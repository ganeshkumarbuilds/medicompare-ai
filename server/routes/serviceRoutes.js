import express from "express";

import {
  createService,
  getServices,
  searchServices,
  getServiceById,
  compareServices,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);

router.get("/search", searchServices);

router.get("/compare", compareServices);

router.get("/:id", getServiceById);

router.post("/", createService);

export default router;