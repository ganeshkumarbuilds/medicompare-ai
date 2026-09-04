package com.medicompare.controller;

import com.medicompare.entity.Hospital;
import com.medicompare.repository.HospitalRepository;
import com.medicompare.specification.HospitalSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalRepository hospitalRepository;

    public HospitalController(
            HospitalRepository hospitalRepository
    ) {
        this.hospitalRepository = hospitalRepository;
    }


    // =========================================================
    // SEARCH / FILTER HOSPITALS
    // =========================================================

    @GetMapping
    public ResponseEntity<Page<Hospital>> searchHospitals(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            String city,

            @RequestParam(required = false)
            String hospitalType,

            @RequestParam(required = false)
            Double minRating,

            @RequestParam(required = false)
            Double maxFee,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "rating")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction
    ) {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("asc")
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                sortDirection,
                                sortBy
                        )
                );

        Page<Hospital> hospitals =
                hospitalRepository.findAll(
                        HospitalSpecification.filter(
                                search,
                                city,
                                hospitalType,
                                minRating,
                                maxFee
                        ),
                        pageable
                );

        return ResponseEntity.ok(hospitals);
    }


    // =========================================================
    // GET HOSPITAL
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(
            @PathVariable Long id
    ) {

        return hospitalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================================================
    // CREATE HOSPITAL
    // =========================================================

    @PostMapping
    public ResponseEntity<Hospital> createHospital(
            @RequestBody Hospital hospital
    ) {

        hospital.setId(null);

        Hospital savedHospital =
                hospitalRepository.save(hospital);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedHospital);
    }


    // =========================================================
    // UPDATE HOSPITAL
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(
            @PathVariable Long id,
            @RequestBody Hospital hospitalDetails
    ) {

        return hospitalRepository.findById(id)
                .map(hospital -> {

                    hospital.setName(
                            hospitalDetails.getName()
                    );

                    hospital.setCity(
                            hospitalDetails.getCity()
                    );

                    hospital.setAddress(
                            hospitalDetails.getAddress()
                    );

                    hospital.setPhoneNumber(
                            hospitalDetails.getPhoneNumber()
                    );

                    hospital.setRating(
                            hospitalDetails.getRating()
                    );

                    hospital.setConsultationFee(
                            hospitalDetails
                                    .getConsultationFee()
                    );

                    hospital.setLocation(
                            hospitalDetails.getLocation()
                    );

                    hospital.setHospitalType(
                            hospitalDetails
                                    .getHospitalType()
                    );

                    hospital.setDescription(
                            hospitalDetails
                                    .getDescription()
                    );

                    hospital.setImageUrl(
                            hospitalDetails
                                    .getImageUrl()
                    );

                    return ResponseEntity.ok(
                            hospitalRepository.save(
                                    hospital
                            )
                    );
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================================================
    // DELETE HOSPITAL
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(
            @PathVariable Long id
    ) {

        if (!hospitalRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        hospitalRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}