package com.medicompare.image;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalImageRepository
        extends JpaRepository<HospitalImage, Long> {

    List<HospitalImage> findByHospitalId(Long hospitalId);

    List<HospitalImage> findByHospitalIdAndPrimaryImageTrue(
            Long hospitalId
    );

    Optional<HospitalImage> findByIdAndHospitalId(
            Long imageId,
            Long hospitalId
    );

    long countByHospitalId(Long hospitalId);
}