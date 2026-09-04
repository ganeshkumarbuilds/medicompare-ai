package com.medicompare.recommendation.ml;

import com.medicompare.entity.Hospital;
import com.medicompare.review.repository.HospitalReviewRepository;
import com.medicompare.serviceentity.HospitalService;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Component
public class HospitalPredictionEngine {

    private static final double SERVICE_WEIGHT = 0.30;
    private static final double RATING_WEIGHT = 0.25;
    private static final double PRICE_WEIGHT = 0.20;
    private static final double LOCATION_WEIGHT = 0.15;
    private static final double TYPE_WEIGHT = 0.10;

    private final HospitalReviewRepository reviewRepository;

    public HospitalPredictionEngine(
            HospitalReviewRepository reviewRepository
    ) {
        this.reviewRepository = reviewRepository;
    }

    public List<HospitalPredictionResult> predict(
            HospitalPredictionRequest request,
            List<Hospital> hospitals,
            List<HospitalService> services
    ) {

        if (request == null
                || hospitals == null
                || hospitals.isEmpty()) {
            return new ArrayList<>();
        }

        List<HospitalPredictionResult> results =
                new ArrayList<>();

        for (Hospital hospital : hospitals) {

            if (hospital == null) {
                continue;
            }

            HospitalService matchedService =
                    findBestService(
                            hospital,
                            request.getService(),
                            services
                    );

            if (matchedService == null) {
                continue;
            }

            if (matchedService.getAvailable() != null
                    && !matchedService.getAvailable()) {
                continue;
            }

            double serviceScore =
                    calculateServiceScore(
                            request.getService(),
                            matchedService
                    );

            double ratingScore =
                    calculateRatingScore(hospital);

            ReviewData reviewData =
                    loadReviewData(hospital);

            double reviewScore =
                    calculateReviewScore(reviewData);

            double qualityScore =
                    calculateCombinedQualityScore(
                            ratingScore,
                            reviewScore
                    );

            double priceScore =
                    calculatePriceScore(
                            request,
                            matchedService
                    );

            double locationScore =
                    calculateLocationScore(
                            request,
                            hospital
                    );

            double typeScore =
                    calculateTypeScore(
                            request,
                            hospital
                    );

            double predictionScore =
                    (serviceScore * SERVICE_WEIGHT)
                            + (qualityScore * RATING_WEIGHT)
                            + (priceScore * PRICE_WEIGHT)
                            + (locationScore * LOCATION_WEIGHT)
                            + (typeScore * TYPE_WEIGHT);

            predictionScore =
                    clamp(
                            predictionScore,
                            0.0,
                            1.0
                    );

            double confidence =
                    calculateConfidence(
                            serviceScore,
                            qualityScore,
                            priceScore,
                            locationScore,
                            typeScore
                    );

            List<String> reasons =
                    buildReasons(
                            request,
                            hospital,
                            matchedService,
                            serviceScore,
                            qualityScore,
                            priceScore,
                            locationScore,
                            typeScore,
                            reviewData
                    );

            results.add(
                    new HospitalPredictionResult(
                            hospital.getId(),
                            hospital.getName(),
                            hospital.getCity(),
                            hospital.getHospitalType(),
                            matchedService.getName(),
                            matchedService.getPrice(),
                            hospital.getRating(),
                            reviewData.averageRating(),
                            reviewData.reviewCount(),
                            reviewData.confidence(),
                            round(predictionScore * 100.0),
                            round(confidence * 100.0),
                            determineRecommendationLevel(
                                    predictionScore
                            ),
                            reasons
                    )
            );
        }

        results.sort(
                Comparator.comparing(
                        HospitalPredictionResult::getPredictionScore,
                        Comparator.nullsLast(
                                Comparator.reverseOrder()
                        )
                )
        );

        return results;
    }

    private HospitalService findBestService(
            Hospital hospital,
            String requestedService,
            List<HospitalService> services
    ) {

        if (requestedService == null
                || requestedService.isBlank()
                || services == null
                || services.isEmpty()) {
            return null;
        }

        String requested =
                normalize(requestedService);

        HospitalService bestService = null;
        int bestScore = 0;

        for (HospitalService service : services) {

            if (service == null
                    || service.getHospital() == null
                    || service.getName() == null) {
                continue;
            }

            if (!hospital.getId().equals(
                    service.getHospital().getId())) {
                continue;
            }

            String serviceName =
                    normalize(service.getName());

            int score =
                    calculateTextMatch(
                            requested,
                            serviceName
                    );

            if (score > bestScore) {
                bestScore = score;
                bestService = service;
            }
        }

        return bestService;
    }

    private int calculateTextMatch(
            String requested,
            String actual
    ) {

        if (requested.equals(actual)) {
            return 100;
        }

        if (actual.contains(requested)) {
            return 90;
        }

        if (requested.contains(actual)) {
            return 80;
        }

        String[] words =
                requested.split("\\s+");

        int matchedWords = 0;

        for (String word : words) {

            if (word.length() < 3) {
                continue;
            }

            if (actual.contains(word)) {
                matchedWords++;
            }
        }

        if (matchedWords == 0) {
            return 0;
        }

        return Math.min(
                70,
                40 + matchedWords * 10
        );
    }

    private double calculateServiceScore(
            String requestedService,
            HospitalService service
    ) {

        if (requestedService == null
                || service == null
                || service.getName() == null) {
            return 0.0;
        }

        int match =
                calculateTextMatch(
                        normalize(requestedService),
                        normalize(service.getName())
                );

        return clamp(
                match / 100.0,
                0.0,
                1.0
        );
    }

    private double calculateRatingScore(
            Hospital hospital
    ) {

        Double rating =
                hospital.getRating();

        if (rating == null) {
            return 0.50;
        }

        return clamp(
                rating / 5.0,
                0.0,
                1.0
        );
    }

    private ReviewData loadReviewData(
            Hospital hospital
    ) {

        Double average =
                reviewRepository.getAverageRating(
                        hospital.getId()
                );

        long count =
                reviewRepository.getReviewCount(
                        hospital.getId()
                );

        if (average == null || average <= 0) {
            average = 0.0;
        }

        double confidence =
                Math.min(
                        count / 50.0,
                        1.0
                );

        return new ReviewData(
                average,
                count,
                confidence
        );
    }

    private double calculateReviewScore(
            ReviewData reviewData
    ) {

        if (reviewData.reviewCount() == 0
                || reviewData.averageRating() <= 0) {

            return 0.50;
        }

        double normalizedReviewRating =
                clamp(
                        reviewData.averageRating() / 5.0,
                        0.0,
                        1.0
                );

        /*
         * When there are only a few reviews,
         * keep the review signal conservative.
         *
         * At 50+ reviews, the real review average
         * receives full influence.
         */
        return
                (normalizedReviewRating
                        * reviewData.confidence())
                        + (0.50
                        * (1.0 - reviewData.confidence()));
    }

    private double calculateCombinedQualityScore(
            double hospitalRatingScore,
            double reviewScore
    ) {

        /*
         * Real user reviews receive slightly more
         * influence than the static hospital rating.
         */
        return clamp(
                (hospitalRatingScore * 0.40)
                        + (reviewScore * 0.60),
                0.0,
                1.0
        );
    }

    private double calculatePriceScore(
            HospitalPredictionRequest request,
            HospitalService service
    ) {

        BigDecimal price =
                service.getPrice();

        if (price == null) {
            return 0.50;
        }

        double servicePrice =
                price.doubleValue();

        if (request.getMaxBudget() == null) {
            return 0.50;
        }

        double budget =
                request.getMaxBudget();

        if (budget <= 0) {
            return 0.50;
        }

        if (servicePrice <= budget) {

            double remaining =
                    (budget - servicePrice)
                            / budget;

            return clamp(
                    0.70 + remaining * 0.30,
                    0.0,
                    1.0
            );
        }

        double excess =
                (servicePrice - budget)
                        / budget;

        return clamp(
                0.70 - excess * 0.70,
                0.0,
                0.70
        );
    }

    private double calculateLocationScore(
            HospitalPredictionRequest request,
            Hospital hospital
    ) {

        String requestedCity =
                normalize(request.getCity());

        if (requestedCity.isBlank()) {
            return 0.50;
        }

        String hospitalCity =
                normalize(hospital.getCity());

        if (hospitalCity.isBlank()) {
            return 0.25;
        }

        if (requestedCity.equals(hospitalCity)) {
            return 1.0;
        }

        if (hospitalCity.contains(requestedCity)
                || requestedCity.contains(hospitalCity)) {
            return 0.85;
        }

        return 0.0;
    }

    private double calculateTypeScore(
            HospitalPredictionRequest request,
            Hospital hospital
    ) {

        String hospitalType =
                normalize(hospital.getHospitalType());

        if (hospitalType.isBlank()) {
            return 0.50;
        }

        boolean privatePreferred =
                Boolean.TRUE.equals(
                        request.getPreferPrivateHospital()
                );

        boolean governmentPreferred =
                Boolean.TRUE.equals(
                        request.getPreferGovernmentHospital()
                );

        if (privatePreferred && !governmentPreferred) {

            if (hospitalType.contains("private")) {
                return 1.0;
            }

            if (hospitalType.contains("government")
                    || hospitalType.contains("public")) {
                return 0.25;
            }
        }

        if (governmentPreferred && !privatePreferred) {

            if (hospitalType.contains("government")
                    || hospitalType.contains("public")) {
                return 1.0;
            }

            if (hospitalType.contains("private")) {
                return 0.25;
            }
        }

        return 0.50;
    }

    private double calculateConfidence(
            double serviceScore,
            double qualityScore,
            double priceScore,
            double locationScore,
            double typeScore
    ) {

        return clamp(
                (serviceScore * 0.35)
                        + (qualityScore * 0.30)
                        + (priceScore * 0.15)
                        + (locationScore * 0.10)
                        + (typeScore * 0.10),
                0.0,
                1.0
        );
    }

    private List<String> buildReasons(
            HospitalPredictionRequest request,
            Hospital hospital,
            HospitalService service,
            double serviceScore,
            double qualityScore,
            double priceScore,
            double locationScore,
            double typeScore,
            ReviewData reviewData
    ) {

        List<String> reasons =
                new ArrayList<>();

        if (serviceScore >= 0.90) {

            reasons.add(
                    "Excellent match for the requested service."
            );

        } else if (serviceScore >= 0.70) {

            reasons.add(
                    "Hospital offers a closely matching service."
            );
        }

        Double rating =
                hospital.getRating();

        if (reviewData.reviewCount() > 0
                && reviewData.averageRating() > 0) {

            reasons.add(
                    String.format(
                            Locale.US,
                            "Real users rate this hospital %.1f/5 based on %d review%s.",
                            reviewData.averageRating(),
                            reviewData.reviewCount(),
                            reviewData.reviewCount() == 1
                                    ? ""
                                    : "s"
                    )
            );

            if (reviewData.reviewCount() >= 50) {

                reasons.add(
                        "The recommendation has strong review-data confidence."
                );
            }

        } else if (rating != null) {

            reasons.add(
                    String.format(
                            Locale.US,
                            "Hospital has a %.1f/5 rating.",
                            rating
                    )
            );

            reasons.add(
                    "Limited user-review data is currently available."
            );
        }

        BigDecimal price =
                service.getPrice();

        if (request.getMaxBudget() != null
                && price != null) {

            if (price.doubleValue()
                    <= request.getMaxBudget()) {

                reasons.add(
                        "Service price is within your budget."
                );

            } else {

                reasons.add(
                        "Service price exceeds your budget."
                );
            }
        }

        if (locationScore >= 0.85) {

            reasons.add(
                    "Hospital matches your preferred location."
            );
        }

        if (Boolean.TRUE.equals(
                request.getPreferPrivateHospital())
                && typeScore >= 0.80) {

            reasons.add(
                    "Matches your private hospital preference."
            );
        }

        if (Boolean.TRUE.equals(
                request.getPreferGovernmentHospital())
                && typeScore >= 0.80) {

            reasons.add(
                    "Matches your government hospital preference."
            );
        }

        if (Boolean.TRUE.equals(
                request.getPreferLowPrice())
                && priceScore >= 0.70) {

            reasons.add(
                    "Offers a favorable price for your requirements."
            );
        }

        if (Boolean.TRUE.equals(
                request.getPreferHighRating())
                && qualityScore >= 0.80) {

            reasons.add(
                    "Strong review and rating match for your preference."
            );
        }

        if (reasons.isEmpty()) {

            reasons.add(
                    "Recommended using available hospital data."
            );
        }

        return reasons;
    }

    private String determineRecommendationLevel(
            double score
    ) {

        if (score >= 0.85) {
            return "EXCELLENT_MATCH";
        }

        if (score >= 0.70) {
            return "STRONG_MATCH";
        }

        if (score >= 0.55) {
            return "GOOD_MATCH";
        }

        if (score >= 0.40) {
            return "POSSIBLE_MATCH";
        }

        return "LOW_MATCH";
    }

    private double clamp(
            double value,
            double minimum,
            double maximum
    ) {

        return Math.max(
                minimum,
                Math.min(maximum, value)
        );
    }

    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;
    }

    private String normalize(
            String value
    ) {

        if (value == null) {
            return "";
        }

        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private record ReviewData(
            double averageRating,
            long reviewCount,
            double confidence
    ) {
    }
}