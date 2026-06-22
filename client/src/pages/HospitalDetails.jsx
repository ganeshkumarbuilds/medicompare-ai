import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [services, setServices] = useState([]);
  const [distance, setDistance] = useState(null);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] =
    useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

      const hospitalServices =
        data.filter(
          (service) =>
            service.hospitalId &&
            service.hospitalId._id === id
        );

      setServices(hospitalServices);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/reviews/hospital/${id}`
      );

      setReviews(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRatingData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/reviews/hospital/${id}/rating`
      );

      setAverageRating(
        data.averageRating
      );

      setTotalReviews(
        data.totalReviews
      );
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        alert(
          "Please login to add review"
        );
        return;
      }

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          userId: user._id,
          hospitalId: id,
          rating,
          comment,
        }
      );

      alert(
        "Review Added Successfully"
      );

      setRating(5);
      setComment("");

      fetchReviews();
      fetchRatingData();
      fetchHospital();
    } catch (error) {
      console.log(error);
      alert("Failed to add review");
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          const response =
            await axios.get(
              `http://localhost:5000/api/hospitals/nearby/search?latitude=${lat}&longitude=${lng}`
            );

          const currentHospital =
            response.data.find(
              (item) =>
                item._id === id
            );

          if (currentHospital) {
            setDistance(
              currentHospital.distance
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const generateSummary =
    async () => {
      try {
        setLoadingSummary(true);

        const { data } =
          await axios.post(
            `http://localhost:5000/api/ai/review-summary/${id}`
          );

        setSummary(
          data.summary
        );

        setLoadingSummary(false);
      } catch (error) {
        console.log(error);

        setLoadingSummary(false);

        alert(
          "Failed to generate summary"
        );
      }
    };

  useEffect(() => {
    fetchHospital();
    fetchServices();
    fetchReviews();
    fetchRatingData();
    getUserLocation();
  }, [id]);

  if (!hospital) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );

    return (
  <div className="max-w-5xl mx-auto px-6 py-10">
    <div className="bg-white shadow-lg rounded-xl p-8">

      <img
        src={
          hospital.image ||
          "https://via.placeholder.com/800x400"
        }
        alt={hospital.name}
        className="w-full h-80 object-cover rounded-2xl mb-6"
      />

      <h1 className="text-4xl font-bold mb-4">
        {hospital.name}
      </h1>

      <p className="mb-2">
        📍 {hospital.address}
      </p>

      {distance !== null && (
        <p className="mb-2 text-green-600 font-semibold">
          📏 {distance.toFixed(2)} km away
        </p>
      )}

      <p className="mb-2">
        🏙️ {hospital.city}
      </p>

      <p className="mb-2">
        🏛️ {hospital.state}
      </p>

      <p className="mb-6 text-lg font-semibold">
        ⭐ {hospital.rating}
      </p>

      <div className="flex gap-3 mb-8">

        <a
          href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          🗺️ Directions
        </a>

        <button
          className="bg-green-600 text-white px-5 py-3 cursor-pointer rounded-lg"
        >
          Book Appointment
        </button>

      </div>

      {/* Rating Card */}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">

        <h2 className="text-2xl font-bold">
          ⭐ {averageRating}
        </h2>

        <p className="text-gray-600">
          {totalReviews} Reviews
        </p>

      </div>

      {/* Services */}

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

                  <h3 className="font-semibold text-lg">
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
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer mt-2"
                  >
                    Book Now
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Add Review */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          ✍️ Add Review
        </h2>

        <div className="bg-gray-50 p-5 rounded-xl">

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(e.target.value)
              )
            }
            className="w-full border p-3 rounded mb-3"
          >
            <option value="5">
              ⭐⭐⭐⭐⭐
            </option>

            <option value="4">
              ⭐⭐⭐⭐
            </option>

            <option value="3">
              ⭐⭐⭐
            </option>

            <option value="2">
              ⭐⭐
            </option>

            <option value="1">
              ⭐
            </option>
          </select>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            placeholder="Write your review..."
            rows="4"
            className="w-full border p-3 rounded mb-3"
          />

          <button
            onClick={submitReview}
            className="bg-yellow-500 text-white px-5 py-3 rounded-lg"
          >
            Submit Review
          </button>

        </div>

      </div>

      {/* Reviews List */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          📝 Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews available
          </p>
        ) : (
          <div className="space-y-4">

            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-xl p-4"
              >

                <div className="flex justify-between mb-2">

                  <h3 className="font-semibold">
                    {review.userId?.name}
                  </h3>

                  <span>
                    ⭐ {review.rating}
                  </span>

                </div>

                <p className="text-gray-700">
                  {review.comment}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* AI Review Summary */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          🤖 AI Review Summary
        </h2>

        <button
          onClick={generateSummary}
          className="bg-purple-600 text-white px-5 py-3 cursor-pointer rounded-lg"
        >
          {loadingSummary
            ? "Generating..."
            : "Generate AI Summary"}
        </button>

        {summary && (
          <div className="mt-5 bg-purple-50 border border-purple-200 rounded-xl p-5">

            <h3 className="text-xl font-bold mb-3">
              ⭐ AI Review Summary
            </h3>

            <p className="whitespace-pre-wrap text-gray-700">
              {summary}
            </p>

          </div>
        )}

      </div>

    </div>
  </div>
);

}
}
export default HospitalDetails;