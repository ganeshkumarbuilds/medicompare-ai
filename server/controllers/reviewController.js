import Review from "../models/Review.js";
import Hospital from "../models/Hospital.js";

const updateHospitalRating = async (
  hospitalId
) => {
  const reviews = await Review.find({
    hospitalId,
  });

  if (reviews.length === 0) {
    await Hospital.findByIdAndUpdate(
      hospitalId,
      { rating: 0 }
    );
    return;
  }

  const avg =
    reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    ) / reviews.length;

  await Hospital.findByIdAndUpdate(
    hospitalId,
    {
      rating: avg.toFixed(1),
    }
  );
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    await updateHospitalRating(review.hospitalId);

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getHospitalReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      hospitalId: req.params.hospitalId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAverageRating = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      hospitalId: req.params.hospitalId,
    });

    if (reviews.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0,
      });
    }

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    );

    const averageRating =
      totalRating / reviews.length;

    res.status(200).json({
      averageRating:
        averageRating.toFixed(1),
      totalReviews:
        reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteReview = async (
  req,
  res
) => {
  try {
    const review =
  await Review.findByIdAndDelete(
    req.params.id
  );

if (review) {
  await updateHospitalRating(
    review.hospitalId
  );
}

    res.status(200).json({
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
