package com.medicompare.config;

import com.medicompare.serviceentity.HospitalService;
import com.medicompare.serviceentity.HospitalServiceRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ServicePricingDataInitializer {

    private final HospitalServiceRepository hospitalServiceRepository;

    public ServicePricingDataInitializer(
            HospitalServiceRepository hospitalServiceRepository
    ) {
        this.hospitalServiceRepository = hospitalServiceRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void updateServicePricing() {

        List<HospitalService> services =
                hospitalServiceRepository.findAll();

        if (services.isEmpty()) {
            System.out.println(
                    "No hospital services found for pricing update."
            );
            return;
        }

        int updated = 0;

        for (HospitalService service : services) {

            if (service.getHospital() == null ||
                    service.getHospital().getId() == null) {
                continue;
            }

            Long hospitalId =
                    service.getHospital().getId();

            String serviceName =
                    service.getName() == null
                            ? ""
                            : service.getName()
                                    .trim()
                                    .toLowerCase();

            BigDecimal price =
                    calculatePrice(
                            serviceName,
                            hospitalId
                    );

            if (price != null) {

                service.setPrice(price);

                hospitalServiceRepository.save(service);

                updated++;
            }
        }

        System.out.println(
                "Service pricing update completed."
        );

        System.out.println(
                "Services updated: " + updated
        );

        System.out.println(
                "Total services in database: "
                        + services.size()
        );
    }

    private BigDecimal calculatePrice(
            String serviceName,
            Long hospitalId
    ) {

        /*
         * Deterministic variation based on hospital ID.
         *
         * This means:
         * - Same hospital gets the same price after restart.
         * - Different hospitals get different prices.
         * - No random price changes.
         */

        int variation =
                (int) (hospitalId % 7);

        switch (serviceName) {

            case "general consultation":
                return BigDecimal.valueOf(
                        350 + (variation * 75)
                );

            case "cardiology consultation":
                return BigDecimal.valueOf(
                        800 + (variation * 150)
                );

            case "dermatology consultation":
                return BigDecimal.valueOf(
                        550 + (variation * 100)
                );

            case "orthopedic consultation":
                return BigDecimal.valueOf(
                        600 + (variation * 125)
                );

            case "health checkup":
                return BigDecimal.valueOf(
                        900 + (variation * 200)
                );

            default:
                return null;
        }
    }
}