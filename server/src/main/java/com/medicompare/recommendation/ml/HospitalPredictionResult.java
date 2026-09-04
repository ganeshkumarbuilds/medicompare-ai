package com.medicompare.recommendation.ml;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class HospitalPredictionResult {

    private Long hospitalId;

    private String hospitalName;

    private String city;

    private String hospitalType;

    private String matchedService;

    private BigDecimal servicePrice;

    private Double hospitalRating;

    private Double reviewAverage;

    private Long reviewCount;

    private Double reviewConfidence;

    private Double predictionScore;

    private Double confidence;

    private String recommendationLevel;

    private List<String> reasons = new ArrayList<>();

    public HospitalPredictionResult() {
    }

    public HospitalPredictionResult(
            Long hospitalId,
            String hospitalName,
            String city,
            String hospitalType,
            String matchedService,
            BigDecimal servicePrice,
            Double hospitalRating,
            Double reviewAverage,
            Long reviewCount,
            Double reviewConfidence,
            Double predictionScore,
            Double confidence,
            String recommendationLevel,
            List<String> reasons
    ) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.city = city;
        this.hospitalType = hospitalType;
        this.matchedService = matchedService;
        this.servicePrice = servicePrice;
        this.hospitalRating = hospitalRating;
        this.reviewAverage = reviewAverage;
        this.reviewCount = reviewCount;
        this.reviewConfidence = reviewConfidence;
        this.predictionScore = predictionScore;
        this.confidence = confidence;
        this.recommendationLevel = recommendationLevel;
        this.reasons = reasons != null
                ? new ArrayList<>(reasons)
                : new ArrayList<>();
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHospitalType() {
        return hospitalType;
    }

    public void setHospitalType(String hospitalType) {
        this.hospitalType = hospitalType;
    }

    public String getMatchedService() {
        return matchedService;
    }

    public void setMatchedService(String matchedService) {
        this.matchedService = matchedService;
    }

    public BigDecimal getServicePrice() {
        return servicePrice;
    }

    public void setServicePrice(BigDecimal servicePrice) {
        this.servicePrice = servicePrice;
    }

    public Double getHospitalRating() {
        return hospitalRating;
    }

    public void setHospitalRating(Double hospitalRating) {
        this.hospitalRating = hospitalRating;
    }

    public Double getReviewAverage() {
        return reviewAverage;
    }

    public void setReviewAverage(Double reviewAverage) {
        this.reviewAverage = reviewAverage;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Double getReviewConfidence() {
        return reviewConfidence;
    }

    public void setReviewConfidence(Double reviewConfidence) {
        this.reviewConfidence = reviewConfidence;
    }

    public Double getPredictionScore() {
        return predictionScore;
    }

    public void setPredictionScore(Double predictionScore) {
        this.predictionScore = predictionScore;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getRecommendationLevel() {
        return recommendationLevel;
    }

    public void setRecommendationLevel(String recommendationLevel) {
        this.recommendationLevel = recommendationLevel;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons != null
                ? new ArrayList<>(reasons)
                : new ArrayList<>();
    }
}