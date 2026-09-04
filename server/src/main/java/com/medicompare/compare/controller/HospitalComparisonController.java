package com.medicompare.compare.controller;

import com.medicompare.compare.dto.HospitalComparisonResponse;
import com.medicompare.compare.service.HospitalComparisonService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compare")
@CrossOrigin(origins = "*")
public class HospitalComparisonController {

    private final HospitalComparisonService comparisonService;

    public HospitalComparisonController(
            HospitalComparisonService comparisonService
    ) {
        this.comparisonService =
                comparisonService;
    }

    // =========================
    // COMPARE HOSPITALS
    // =========================

    @GetMapping("/hospitals")
    public ResponseEntity<?> compareHospitals(
            @RequestParam List<Long> hospitalIds
    ) {

        try {

            if (hospitalIds == null ||
                    hospitalIds.size() < 2 ||
                    hospitalIds.size() > 4) {

                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Select between 2 and 4 hospitals to compare."
                                )
                        );
            }

            List<HospitalComparisonResponse> result =
                    comparisonService.compareHospitals(
                            hospitalIds
                    );

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException exception) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }
}