import mongoose from "mongoose";
import dotenv from "dotenv";

import Hospital from "../models/Hospital.js";
import Service from "../models/Service.js";

dotenv.config();

const commonServices = [
  {
    serviceName: "MRI Scan",
    category: "Radiology",
    price: 4500,
    duration: 60,
    description: "Magnetic Resonance Imaging scan",
  },
  {
    serviceName: "CT Scan",
    category: "Radiology",
    price: 3500,
    duration: 45,
    description: "Computed Tomography scan",
  },
  {
    serviceName: "Blood Test",
    category: "Pathology",
    price: 500,
    duration: 20,
    description: "Complete blood examination",
  },
  {
    serviceName: "X-Ray",
    category: "Radiology",
    price: 800,
    duration: 15,
    description: "Digital X-Ray imaging",
  },
  {
    serviceName: "ECG",
    category: "Cardiology",
    price: 1200,
    duration: 20,
    description: "Electrocardiogram test",
  },
  {
    serviceName: "Heart Checkup",
    category: "Cardiology",
    price: 3000,
    duration: 60,
    description: "Complete cardiac health assessment",
  },
  {
    serviceName: "Ultrasound",
    category: "Radiology",
    price: 2000,
    duration: 30,
    description: "Ultrasound imaging scan",
  },
  {
    serviceName: "Diabetes Test",
    category: "Pathology",
    price: 700,
    duration: 20,
    description: "Blood sugar screening",
  },
  {
    serviceName: "Kidney Function Test",
    category: "Pathology",
    price: 900,
    duration: 25,
    description: "Kidney health assessment",
  },
  {
    serviceName: "Eye Checkup",
    category: "Ophthalmology",
    price: 1000,
    duration: 30,
    description: "Vision and eye health examination",
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");

    const hospitals = await Hospital.find();

    console.log(
      `Found ${hospitals.length} hospitals`
    );

    for (const hospital of hospitals) {
      for (const service of commonServices) {
        await Service.create({
          hospitalId: hospital._id,
          ...service,
        });
      }
    }

    console.log(
      `Added ${
        hospitals.length *
        commonServices.length
      } services`
    );

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedServices();