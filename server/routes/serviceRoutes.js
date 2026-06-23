import express from "express";

import {
  createService,
  getServices,
  searchServices,
  getServiceById,
  compareServices,deleteService
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);

router.get("/search", searchServices);

router.get("/compare", compareServices);

router.get("/:id", getServiceById);

router.post("/", createService);
router.delete("/:id", deleteService);

export default router;