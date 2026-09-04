package com.medicompare.recommendation.ml;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class HospitalPredictionRequest {

    @NotBlank(message = "Service is required")
    @Size(max = 150, message = "Service must not exceed 150 characters")
    private String service;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Min(value = 0, message = "Maximum budget cannot be negative")
    private Double maxBudget;

    @Min(value = 0, message = "Minimum rating cannot be negative")
    @Max(value = 5, message = "Minimum rating cannot exceed 5")
    private Double minimumRating;

    private Boolean preferLowPrice;

    private Boolean preferHighRating;

    private Boolean preferNearby;

    private Boolean preferPrivateHospital;

    private Boolean preferGovernmentHospital;

    public HospitalPredictionRequest() {
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(Double maxBudget) {
        this.maxBudget = maxBudget;
    }

    public Double getMinimumRating() {
        return minimumRating;
    }

    public void setMinimumRating(Double minimumRating) {
        this.minimumRating = minimumRating;
    }

    public Boolean getPreferLowPrice() {
        return preferLowPrice;
    }

    public void setPreferLowPrice(Boolean preferLowPrice) {
        this.preferLowPrice = preferLowPrice;
    }

    public Boolean getPreferHighRating() {
        return preferHighRating;
    }

    public void setPreferHighRating(Boolean preferHighRating) {
        this.preferHighRating = preferHighRating;
    }

    public Boolean getPreferNearby() {
        return preferNearby;
    }

    public void setPreferNearby(Boolean preferNearby) {
        this.preferNearby = preferNearby;
    }

    public Boolean getPreferPrivateHospital() {
        return preferPrivateHospital;
    }

    public void setPreferPrivateHospital(Boolean preferPrivateHospital) {
        this.preferPrivateHospital = preferPrivateHospital;
    }

    public Boolean getPreferGovernmentHospital() {
        return preferGovernmentHospital;
    }

    public void setPreferGovernmentHospital(Boolean preferGovernmentHospital) {
        this.preferGovernmentHospital = preferGovernmentHospital;
    }
}