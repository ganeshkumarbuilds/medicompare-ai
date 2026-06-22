import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    price: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/services/${id}`
      );

      setFormData({
        serviceName: data.serviceName || "",
        category: data.category || "",
        price: data.price || "",
        duration: data.duration || "",
        description: data.description || "",
      });
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
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/services/${id}`,
        formData
      );

      alert("Service Updated Successfully");

      navigate("/admin/manage-services");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              🩺 Edit Service
            </h1>

            <p className="text-gray-500 mt-2">
              Update service information
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 font-medium">
                Service Name
              </label>

              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 font-medium">
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Duration (mins)
                </label>

                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 cursor-pointer rounded-xl"
              >
                {loading
                  ? "Updating..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/manage-services")
                }
                className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer px-8 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default EditService;