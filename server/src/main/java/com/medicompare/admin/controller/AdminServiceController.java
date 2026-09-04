package com.medicompare.admin.controller;

import com.medicompare.entity.Hospital;
import com.medicompare.repository.HospitalRepository;
import com.medicompare.serviceentity.HospitalService;
import com.medicompare.serviceentity.HospitalServiceRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hospitals/{hospitalId}/services")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminServiceController {

    private final HospitalServiceRepository serviceRepository;

    private final HospitalRepository hospitalRepository;

    public AdminServiceController(
            HospitalServiceRepository serviceRepository,
            HospitalRepository hospitalRepository
    ) {
        this.serviceRepository = serviceRepository;
        this.hospitalRepository = hospitalRepository;
    }

    // =========================================================
    // GET ALL SERVICES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<HospitalService>> getServices(
            @PathVariable Long hospitalId
    ) {

        if (!hospitalRepository.existsById(hospitalId)) {
            return ResponseEntity.notFound().build();
        }

        List<HospitalService> services =
                serviceRepository.findByHospitalId(hospitalId);

        return ResponseEntity.ok(services);
    }

    // =========================================================
    // GET SERVICE BY ID
    // =========================================================

    @GetMapping("/{serviceId}")
    public ResponseEntity<HospitalService> getService(
            @PathVariable Long hospitalId,
            @PathVariable Long serviceId
    ) {

        HospitalService service =
                serviceRepository.findById(serviceId).orElse(null);

        if (service == null) {
            return ResponseEntity.notFound().build();
        }

        if (
                service.getHospital() == null
                        ||
                service.getHospital().getId() == null
                        ||
                !service.getHospital()
                        .getId()
                        .equals(hospitalId)
        ) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(service);
    }

    // =========================================================
    // CREATE SERVICE
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createService(
            @PathVariable Long hospitalId,
            @Valid @RequestBody HospitalService service
    ) {

        Hospital hospital =
                hospitalRepository.findById(hospitalId).orElse(null);

        if (hospital == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Hospital not found with id: "
                                    + hospitalId
                    );
        }

        String serviceName =
                service.getName().trim();

        // -----------------------------------------------------
        // DUPLICATE SERVICE CHECK
        // -----------------------------------------------------

        boolean duplicate =
                serviceRepository
                        .existsByHospitalIdAndNameIgnoreCase(
                                hospitalId,
                                serviceName
                        );

        if (duplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "A service named '"
                                    + serviceName
                                    + "' already exists for this hospital."
                    );
        }

        service.setId(null);

        service.setHospital(hospital);

        service.setName(serviceName);

        if (service.getAvailable() == null) {
            service.setAvailable(true);
        }

        HospitalService savedService =
                serviceRepository.save(service);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedService);
    }

    // =========================================================
    // UPDATE SERVICE
    // =========================================================

    @PutMapping("/{serviceId}")
    public ResponseEntity<?> updateService(
            @PathVariable Long hospitalId,
            @PathVariable Long serviceId,
            @Valid @RequestBody HospitalService updatedService
    ) {

        HospitalService existingService =
                serviceRepository.findById(serviceId).orElse(null);

        // -----------------------------------------------------
        // SERVICE DOES NOT EXIST
        // -----------------------------------------------------

        if (existingService == null) {
            return ResponseEntity.notFound().build();
        }

        // -----------------------------------------------------
        // SERVICE BELONGS TO DIFFERENT HOSPITAL
        // -----------------------------------------------------

        if (
                existingService.getHospital() == null
                        ||
                existingService.getHospital().getId() == null
                        ||
                !existingService.getHospital()
                        .getId()
                        .equals(hospitalId)
        ) {
            return ResponseEntity.notFound().build();
        }

        String serviceName =
                updatedService.getName().trim();

        // -----------------------------------------------------
        // DUPLICATE CHECK
        // -----------------------------------------------------

        boolean duplicate =
                serviceRepository
                        .existsByHospitalIdAndNameIgnoreCase(
                                hospitalId,
                                serviceName
                        );

        boolean sameName =
                existingService
                        .getName()
                        .equalsIgnoreCase(serviceName);

        if (duplicate && !sameName) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "A service named '"
                                    + serviceName
                                    + "' already exists for this hospital."
                    );
        }

        // -----------------------------------------------------
        // UPDATE
        // -----------------------------------------------------

        existingService.setName(serviceName);

        existingService.setDescription(
                updatedService.getDescription()
        );

        existingService.setPrice(
                updatedService.getPrice()
        );

        existingService.setCategory(
                updatedService.getCategory()
        );

        existingService.setDurationMinutes(
                updatedService.getDurationMinutes()
        );

        if (updatedService.getAvailable() == null) {
            existingService.setAvailable(true);
        } else {
            existingService.setAvailable(
                    updatedService.getAvailable()
            );
        }

        HospitalService savedService =
                serviceRepository.save(existingService);

        return ResponseEntity.ok(savedService);
    }

    // =========================================================
    // DELETE SERVICE
    // =========================================================

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long hospitalId,
            @PathVariable Long serviceId
    ) {

        HospitalService service =
                serviceRepository.findById(serviceId).orElse(null);

        if (service == null) {
            return ResponseEntity.notFound().build();
        }

        if (
                service.getHospital() == null
                        ||
                service.getHospital().getId() == null
                        ||
                !service.getHospital()
                        .getId()
                        .equals(hospitalId)
        ) {
            return ResponseEntity.notFound().build();
        }

        serviceRepository.delete(service);

        return ResponseEntity.noContent().build();
    }
}