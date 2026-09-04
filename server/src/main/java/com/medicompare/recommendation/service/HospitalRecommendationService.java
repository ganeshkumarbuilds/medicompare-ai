package com.medicompare.recommendation.service;

import com.medicompare.entity.Hospital;
import com.medicompare.repository.HospitalRepository;
import com.medicompare.recommendation.ml.HospitalPredictionEngine;
import com.medicompare.recommendation.ml.HospitalPredictionRequest;
import com.medicompare.recommendation.ml.HospitalPredictionResult;
import com.medicompare.serviceentity.HospitalService;
import com.medicompare.serviceentity.HospitalServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class HospitalRecommendationService {

    private final HospitalRepository hospitalRepository;
    private final HospitalServiceRepository hospitalServiceRepository;
    private final HospitalPredictionEngine predictionEngine;

    public HospitalRecommendationService(
            HospitalRepository hospitalRepository,
            HospitalServiceRepository hospitalServiceRepository,
            HospitalPredictionEngine predictionEngine
    ) {
        this.hospitalRepository = hospitalRepository;
        this.hospitalServiceRepository = hospitalServiceRepository;
        this.predictionEngine = predictionEngine;
    }

    public List<HospitalPredictionResult> recommend(
            HospitalPredictionRequest request
    ) {
        List<Hospital> hospitals = loadHospitals(request);

        List<HospitalService> services =
                hospitalServiceRepository.findAll();

        return predictionEngine.predict(
                request,
                hospitals,
                services
        );
    }

    private List<Hospital> loadHospitals(
            HospitalPredictionRequest request
    ) {
        if (request.getCity() != null
                && !request.getCity().isBlank()) {

            return hospitalRepository.findByCityIgnoreCase(
                    request.getCity().trim()
            );
        }

        return hospitalRepository.findAll();
    }
}