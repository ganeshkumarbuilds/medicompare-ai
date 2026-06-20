import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [services, setServices] = useState([]);

  const fetchHospital = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/hospitals/${id}`
      );

      setHospital(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/services"
      );

      const hospitalServices = data.filter(
        (service) =>
          String(service.hospitalId?._id) === String(id)
      );

      setServices(hospitalServices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospital();
    fetchServices();
  }, [id]);

  if (!hospital) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-4xl font-bold mb-4">
          {hospital.name}
        </h1>

        <p className="mb-2">
          📍 {hospital.address}
        </p>

        <p className="mb-2">
          🏙️ {hospital.city}
        </p>

        <p className="mb-2">
          🏛️ {hospital.state}
        </p>

        <p className="mb-6">
          ⭐ {hospital.rating}
        </p>

        <button className="bg-green-600 text-white px-5 py-3 rounded-lg mb-8">
          Book Appointment
        </button>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Services
          </h2>

          {services.length === 0 ? (
            <p className="text-gray-500">
              No services available
            </p>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {service.serviceName}
                    </h3>

                    <p className="text-gray-600">
                      Duration: {service.duration} mins
                    </p>

                    <p className="text-gray-600">
                      {service.category}
                    </p>
                  </div>

                  <div className="text-right">

  <div className="text-green-600 font-bold text-lg">
    ₹{service.price}
  </div>

  <button
    onClick={() =>
      navigate("/book", {
        state: {
          hospital,
          service,
        },
      })
    }
    className="bg-blue-600 text-white px-3 py-2 rounded-lg mt-2"
  >
    Book Now
  </button>

</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HospitalDetails;