import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: String,

    city: String,

    state: String,

    rating: {
      type: Number,
      default: 0,
    },

    image: String,

    latitude: Number,

    longitude: Number,
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model(
  "Hospital",
  hospitalSchema
);

export default Hospital;