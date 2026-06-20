import express from "express";

import {
  createService,
  getServices,
  searchServices,
  getServiceById,compareServices
} from "../controllers/serviceController.js";

const router = express.Router();

router.post("/", createService);

router.get("/", getServices);
router.get("/search/service", searchServices);
router.get("/compare", compareServices);

router.get("/:id", getServiceById);

export default router;