package com.medicompare.config;

import com.medicompare.entity.Hospital;
import com.medicompare.repository.HospitalRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class HospitalImageUrlInitializer {

    /*
     * Each demo hospital receives a different hospital/medical-building
     * image URL.
     *
     * These are representative healthcare facility photographs.
     * They are NOT claimed to be the actual buildings of the fictional
     * demo hospitals in MediCompare.
     *
     * Administrator-uploaded images are preserved because this initializer
     * only replaces the old generated image URLs used by this initializer.
     */
    private static final List<String> HOSPITAL_IMAGES = List.of(

            "https://loremflickr.com/1200/800/hospital,building?lock=101",

            "https://loremflickr.com/1200/800/hospital,building?lock=102",

            "https://loremflickr.com/1200/800/hospital,building?lock=103",

            "https://loremflickr.com/1200/800/hospital,building?lock=104",

            "https://loremflickr.com/1200/800/hospital,building?lock=105",

            "https://loremflickr.com/1200/800/hospital,building?lock=106",

            "https://loremflickr.com/1200/800/hospital,building?lock=107",

            "https://loremflickr.com/1200/800/hospital,building?lock=108",

            "https://loremflickr.com/1200/800/hospital,building?lock=109",

            "https://loremflickr.com/1200/800/hospital,building?lock=110",

            "https://loremflickr.com/1200/800/hospital,building?lock=111",

            "https://loremflickr.com/1200/800/hospital,building?lock=112",

            "https://loremflickr.com/1200/800/hospital,building?lock=113",

            "https://loremflickr.com/1200/800/hospital,building?lock=114",

            "https://loremflickr.com/1200/800/hospital,building?lock=115",

            "https://loremflickr.com/1200/800/hospital,building?lock=116",

            "https://loremflickr.com/1200/800/hospital,building?lock=117",

            "https://loremflickr.com/1200/800/hospital,building?lock=118",

            "https://loremflickr.com/1200/800/hospital,building?lock=119",

            "https://loremflickr.com/1200/800/hospital,building?lock=120",

            "https://loremflickr.com/1200/800/hospital,building?lock=121",

            "https://loremflickr.com/1200/800/hospital,building?lock=122",

            "https://loremflickr.com/1200/800/hospital,building?lock=123",

            "https://loremflickr.com/1200/800/hospital,building?lock=124",

            "https://loremflickr.com/1200/800/hospital,building?lock=125",

            "https://loremflickr.com/1200/800/hospital,building?lock=126",

            "https://loremflickr.com/1200/800/hospital,building?lock=127",

            "https://loremflickr.com/1200/800/hospital,building?lock=128",

            "https://loremflickr.com/1200/800/hospital,building?lock=129",

            "https://loremflickr.com/1200/800/hospital,building?lock=130",

            "https://loremflickr.com/1200/800/hospital,building?lock=131",

            "https://loremflickr.com/1200/800/hospital,building?lock=132",

            "https://loremflickr.com/1200/800/hospital,building?lock=133",

            "https://loremflickr.com/1200/800/hospital,building?lock=134",

            "https://loremflickr.com/1200/800/hospital,building?lock=135",

            "https://loremflickr.com/1200/800/hospital,building?lock=136",

            "https://loremflickr.com/1200/800/hospital,building?lock=137",

            "https://loremflickr.com/1200/800/hospital,building?lock=138",

            "https://loremflickr.com/1200/800/hospital,building?lock=139",

            "https://loremflickr.com/1200/800/hospital,building?lock=140",

            "https://loremflickr.com/1200/800/hospital,building?lock=141",

            "https://loremflickr.com/1200/800/hospital,building?lock=142",

            "https://loremflickr.com/1200/800/hospital,building?lock=143",

            "https://loremflickr.com/1200/800/hospital,building?lock=144",

            "https://loremflickr.com/1200/800/hospital,building?lock=145",

            "https://loremflickr.com/1200/800/hospital,building?lock=146",

            "https://loremflickr.com/1200/800/hospital,building?lock=147",

            "https://loremflickr.com/1200/800/hospital,building?lock=148",

            "https://loremflickr.com/1200/800/hospital,building?lock=149",

            "https://loremflickr.com/1200/800/hospital,building?lock=150",

            "https://loremflickr.com/1200/800/hospital,building?lock=151"
    );


    @Bean
    CommandLineRunner assignHospitalImages(
            HospitalRepository hospitalRepository
    ) {

        return args -> {

            System.out.println(
                    "Checking hospital image URLs..."
            );

            List<Hospital> hospitals =
                    hospitalRepository.findAll();

            int updated = 0;

            for (int i = 0; i < hospitals.size(); i++) {

                Hospital hospital =
                        hospitals.get(i);

                /*
                 * Keep administrator-uploaded/local images.
                 *
                 * We only replace the old Unsplash URLs generated
                 * by the previous initializer.
                 */
                String currentImage =
                        hospital.getImageUrl();

                if (currentImage != null
                        && !currentImage.isBlank()
                        && !currentImage.contains("images.unsplash.com")
                        && !currentImage.contains("loremflickr.com")) {

                    continue;
                }

                String imageUrl =
                        HOSPITAL_IMAGES.get(
                                i % HOSPITAL_IMAGES.size()
                        );

                hospital.setImageUrl(imageUrl);

                hospitalRepository.save(hospital);

                updated++;
            }

            System.out.println(
                    "Hospital images updated: "
                            + updated
            );

            System.out.println(
                    "Hospitals checked: "
                            + hospitals.size()
            );
        };
    }
}