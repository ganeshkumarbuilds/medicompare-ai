package com.medicompare.config;

import com.medicompare.entity.Hospital;
import com.medicompare.repository.HospitalRepository;
import com.medicompare.review.entity.HospitalReview;
import com.medicompare.review.repository.HospitalReviewRepository;
import com.medicompare.user.entity.User;
import com.medicompare.user.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

/*
 * Seeds two realistic reviews for every hospital so the
 * platform has real rating data to display and for the
 * recommendation engine to use, instead of empty defaults.
 *
 * Runs AFTER HospitalDataInitializer, since hospitals must
 * already exist before reviews can be attached to them.
 */
@Component
@Order(2)
public class HospitalReviewDataInitializer implements CommandLineRunner {

    private static final String REVIEWER_ONE_EMAIL = "priya.reviewer@medicompare.com";
    private static final String REVIEWER_ONE_NAME = "Priya Sharma";

    private static final String REVIEWER_TWO_EMAIL = "rahul.reviewer@medicompare.com";
    private static final String REVIEWER_TWO_NAME = "Rahul Verma";

    /*
     * Reviewer accounts are seeded with a random, never-used
     * password since they only exist to attach reviews and
     * are never meant to log in.
     */
    private static final String SEED_PASSWORD = "SeededReviewer#2026";

    private static final List<String> POSITIVE_COMMENTS = List.of(
            "Great experience overall. The doctors were attentive and the wait time was minimal.",
            "Clean facility and friendly staff. Would recommend for general consultations.",
            "Very professional care, and the billing process was transparent with no hidden charges.",
            "Good service and the consultation felt thorough. Staff explained everything clearly.",
            "Convenient location and the staff were courteous throughout my visit.",
            "The doctors here took time to answer all my questions. Felt well taken care of."
    );

    private static final List<String> MIXED_COMMENTS = List.of(
            "Decent experience, though the waiting time was a bit longer than expected.",
            "The treatment was fine, but the reception process could be faster.",
            "Good doctors, but the facility could use some updates.",
            "Service was okay overall. Nothing exceptional, but got the job done.",
            "The consultation was helpful, though scheduling an appointment took a few tries.",
            "Reasonable pricing and helpful staff, though the place gets crowded during peak hours."
    );

    private final HospitalRepository hospitalRepository;
    private final HospitalReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    public HospitalReviewDataInitializer(
            HospitalRepository hospitalRepository,
            HospitalReviewRepository reviewRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.hospitalRepository = hospitalRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        User reviewerOne =
                findOrCreateReviewer(
                        REVIEWER_ONE_EMAIL,
                        REVIEWER_ONE_NAME
                );

        User reviewerTwo =
                findOrCreateReviewer(
                        REVIEWER_TWO_EMAIL,
                        REVIEWER_TWO_NAME
                );

        List<Hospital> hospitals =
                hospitalRepository.findAll();

        int seededCount = 0;

        for (Hospital hospital : hospitals) {

            seededCount +=
                    seedReviewIfMissing(
                            reviewerOne,
                            hospital,
                            true
                    );

            seededCount +=
                    seedReviewIfMissing(
                            reviewerTwo,
                            hospital,
                            false
                    );
        }

        if (seededCount > 0) {

            System.out.println();
            System.out.println("==============================================");
            System.out.println("Hospital review seeding complete");
            System.out.println("New reviews created: " + seededCount);
            System.out.println("Hospitals checked: " + hospitals.size());
            System.out.println("==============================================");
            System.out.println();
        }
    }

    private User findOrCreateReviewer(
            String email,
            String name
    ) {

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseGet(() -> {

                    User reviewer = new User();

                    reviewer.setName(name);
                    reviewer.setEmail(email);
                    reviewer.setPassword(
                            passwordEncoder.encode(SEED_PASSWORD)
                    );
                    reviewer.setRole("USER");
                    reviewer.setEnabled(true);

                    return userRepository.save(reviewer);
                });
    }

    /*
     * Returns 1 if a new review was created, 0 if one
     * already existed for this user/hospital pair.
     */
    private int seedReviewIfMissing(
            User reviewer,
            Hospital hospital,
            boolean favorPositive
    ) {

        if (reviewer.getId() == null
                || hospital.getId() == null) {
            return 0;
        }

        if (reviewRepository.existsByUserIdAndHospitalId(
                reviewer.getId(),
                hospital.getId()
        )) {
            return 0;
        }

        HospitalReview review = new HospitalReview();

        review.setUser(reviewer);
        review.setHospital(hospital);
        review.setRating(
                generateRating(favorPositive)
        );
        review.setComment(
                pickComment(favorPositive)
        );

        reviewRepository.save(review);

        return 1;
    }

    /*
     * Skews ratings toward 4-5 stars for the "positive"
     * reviewer and 3-4 stars for the "mixed" reviewer, so
     * hospitals end up with realistic, varied averages
     * rather than a flat perfect score everywhere.
     */
    private Integer generateRating(boolean favorPositive) {

        if (favorPositive) {
            return random.nextBoolean() ? 5 : 4;
        }

        return random.nextBoolean() ? 4 : 3;
    }

    private String pickComment(boolean favorPositive) {

        List<String> pool =
                favorPositive
                        ? POSITIVE_COMMENTS
                        : MIXED_COMMENTS;

        return pool.get(
                random.nextInt(pool.size())
        );
    }
}