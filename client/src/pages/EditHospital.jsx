import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditHospital() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    rating: "",
    image: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchHospital();
  }, []);

  const fetchHospital = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hospitals/${id}`
      );

      setFormData({
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        rating: data.rating || "",
        image: data.image || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
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
        `${import.meta.env.VITE_API_URL}/api/hospitals/${id}`,
        formData
      );

      alert("Hospital Updated Successfully");

      navigate("/admin/manage-hospitals");
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
              ✏️ Edit Hospital
            </h1>

            <p className="text-gray-500 mt-2">
              Update hospital details
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block mb-2 font-medium">
                Hospital Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium">
                  Rating
                </label>

                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium">
                  Latitude
                </label>

                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Longitude
                </label>

                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            {formData.image && (
              <div>
                <p className="font-medium mb-2">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Hospital"
                  className="w-full h-60 object-cover rounded-xl border"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-8 py-3 rounded-xl"
              >
                {loading
                  ? "Updating..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/manage-hospitals")
                }
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 cursor-pointer rounded-xl"
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

export default EditHospital;