import { useEffect, useState } from "react";
import axios from "axios";

function AddService() {
  const [hospitals, setHospitals] = useState([]);

  const [formData, setFormData] = useState({
    hospitalId: "",
    serviceName: "",
    category: "",
    price: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/hospitals"
      );

      setHospitals(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/services",
        formData
      );

      alert("Service Added");

      setFormData({
        hospitalId: "",
        serviceName: "",
        category: "",
        price: "",
        duration: "",
        description: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  const generateDefaultServices = async () => {
    if (!formData.hospitalId) {
      alert("Please select a hospital first");
      return;
    }

    const defaultServices = [
      {
        serviceName: "MRI Scan",
        category: "Radiology",
        price: 4500,
        duration: 60,
        description:
          "Magnetic Resonance Imaging scan",
      },
      {
        serviceName: "CT Scan",
        category: "Radiology",
        price: 3500,
        duration: 45,
        description:
          "Computed Tomography scan",
      },
      {
        serviceName: "Blood Test",
        category: "Pathology",
        price: 500,
        duration: 20,
        description:
          "Complete blood examination",
      },
      {
        serviceName: "X-Ray",
        category: "Radiology",
        price: 800,
        duration: 15,
        description:
          "Digital X-Ray imaging",
      },
      {
        serviceName: "Heart Checkup",
        category: "Cardiology",
        price: 3000,
        duration: 60,
        description:
          "Comprehensive cardiac evaluation",
      },
    ];

    try {
      for (const service of defaultServices) {
        await axios.post(
          "http://localhost:5000/api/services",
          {
            hospitalId:
              formData.hospitalId,
            ...service,
          }
        );
      }

      alert(
        "5 Default Services Added Successfully"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Failed to generate services"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Add Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >

        <select
          name="hospitalId"
          value={formData.hospitalId}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="">
            Select Hospital
          </option>

          {hospitals.map((hospital) => (
            <option
              key={hospital._id}
              value={hospital._id}
            >
              {hospital.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={generateDefaultServices}
          className="w-full bg-purple-600 text-white py-3 cursor-pointer rounded-lg font-semibold"
        >
          ⚡ Generate 5 Default Services
        </button>

        <input
          type="text"
          name="serviceName"
          placeholder="Service Name"
          value={formData.serviceName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 cursor-pointer rounded-lg"
        >
          Add Service
        </button>

      </form>

    </div>
  );
}

export default AddService;