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
import java.util.stream.Collectors;

/*
 * Seeds a minimum of 6 realistic reviews for every hospital, each
 * by a different user, with a balanced mix of positive and
 * negative experiences so hospitals can be compared by user
 * experience.
 *
 * Runs AFTER HospitalDataInitializer, since hospitals must
 * already exist before reviews can be attached to them.
 *
 * Idempotent: existing user/hospital pairs are never duplicated,
 * so re-runs only top-up hospitals that still have fewer than
 * MIN_REVIEWS_PER_HOSPITAL reviews.
 */
@Component
@Order(2)
public class HospitalReviewDataInitializer implements CommandLineRunner {

    private static final int MIN_REVIEWS_PER_HOSPITAL = 6;

    private static final List<ReviewerDef> REVIEWERS = List.of(
            new ReviewerDef("priya.reviewer@medicompare.com", "Priya Sharma"),
            new ReviewerDef("rahul.reviewer@medicompare.com", "Rahul Verma"),
            new ReviewerDef("ananya.reviewer@medicompare.com", "Ananya Iyer"),
            new ReviewerDef("vikram.reviewer@medicompare.com", "Vikram Singh"),
            new ReviewerDef("sneha.reviewer@medicompare.com", "Sneha Reddy"),
            new ReviewerDef("arjun.reviewer@medicompare.com", "Arjun Nair"),
            new ReviewerDef("kavya.reviewer@medicompare.com", "Kavya Patel"),
            new ReviewerDef("rohit.reviewer@medicompare.com", "Rohit Kumar")
    );

    /*
     * Reviewer accounts are seeded with a never-used password
     * since they only exist to attach reviews and are never
     * meant to log in.
     */
    private static final String SEED_PASSWORD = "SeededReviewer#2026";

    private static final List<String> FIVE_STAR_COMMENTS = List.of(
            "Excellent experience! The doctors were highly knowledgeable and the staff went out of their way to help.",
            "Outstanding care from admission to discharge. Spotlessly clean wards and very attentive nurses.",
            "Best hospital visit I have had. Diagnosis was accurate, treatment was quick, and billing was fully transparent.",
            "Wonderful doctors who patiently answered every question. My recovery was faster than expected.",
            "Top-class facility with modern equipment. The consultation felt thorough and completely unhurried.",
            "Very impressed with the emergency response. They acted fast and kept my family informed throughout.",
            "Great experience overall. The doctors were attentive and the wait time was minimal.",
            "Clean facility and friendly staff. Would recommend for general consultations."
    );

    private static final List<String> FOUR_STAR_COMMENTS = List.of(
            "Very good experience. Doctor was knowledgeable, though I had to wait about 20 minutes past my slot.",
            "Good service and the consultation felt thorough. Staff explained everything clearly.",
            "Pleasant visit overall. Pharmacy and lab are in-house which saved a lot of time.",
            "Competent doctors and courteous nurses. Parking was a bit difficult but care quality was high.",
            "Satisfied with the treatment. Follow-up call from the hospital was a nice touch.",
            "Convenient location and the staff were courteous throughout my visit."
    );

    private static final List<String> THREE_STAR_COMMENTS = List.of(
            "Average experience. Treatment was fine but the waiting time was much longer than expected.",
            "Doctors are good but the reception and billing counters were understaffed and slow.",
            "Decent care, though the facility looks dated and the rooms could be cleaner.",
            "Consultation was helpful, but scheduling an appointment took several tries on the phone.",
            "Reasonable pricing and okay staff, but the place gets very crowded during peak hours.",
            "Service was okay overall. Nothing exceptional, but they got the job done."
    );

    private static final List<String> TWO_STAR_COMMENTS = List.of(
            "Disappointing visit. Waited over two hours and the consultation itself lasted barely five minutes.",
            "Staff seemed overworked and inattentive. Had to ask three times just to get my reports.",
            "Treatment helped eventually, but billing had unexpected extra charges that were hard to get clarified.",
            "Hygiene in the waiting area was poor and washrooms were not maintained. Doctors were okay though.",
            "Appointment system is chaotic. My confirmed slot was delayed and no proper explanation was given.",
            "Nurses were polite but the junior doctor seemed rushed and did not address all my concerns."
    );

    private static final List<String> ONE_STAR_COMMENTS = List.of(
            "Very poor experience. Misdiagnosed initially and had to visit another hospital for correct treatment.",
            "Rude behaviour at the reception and zero coordination between departments. Felt completely ignored.",
            "Overpriced and unprofessional. Was pushed into unnecessary tests without clear explanation.",
            "Worst waiting management I have seen. No token system, no updates, and staff were dismissive.",
            "Unhygienic rooms and delayed discharge formalities added unnecessary stress to an already tough time.",
            "Doctor barely examined me before prescribing. I did not feel safe continuing treatment here."
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

        List<User> reviewers = REVIEWERS.stream()
                .map(def -> findOrCreateReviewer(
                        def.email(),
                        def.name()
                ))
                .toList();

        List<Hospital> hospitals =
                hospitalRepository.findAll();

        int seededCount = 0;
        int hospitalsToppedUp = 0;

        for (Hospital hospital : hospitals) {
            if (hospital.getId() == null) {
                continue;
            }

            long existing =
                    reviewRepository.countByHospitalId(
                            hospital.getId()
                    );

            if (existing >= MIN_REVIEWS_PER_HOSPITAL) {
                continue;
            }

            int needed =
                    (int) (MIN_REVIEWS_PER_HOSPITAL - existing);

            // Shuffle reviewer order per hospital so different
            // hospitals get a different mix of authors.
            List<User> order =
                    new java.util.ArrayList<>(reviewers);
            java.util.Collections.shuffle(order, random);

            java.util.Set<String> usedComments =
                    loadUsedComments(hospital.getId());

            int createdForHospital = 0;

            for (User reviewer : order) {
                if (createdForHospital >= needed) {
                    break;
                }

                if (reviewer.getId() == null) {
                    continue;
                }

                if (reviewRepository.existsByUserIdAndHospitalId(
                        reviewer.getId(),
                        hospital.getId()
                )) {
                    continue;
                }

                int rating = generateBalancedRating();
                String comment =
                        pickUniqueComment(rating, usedComments);

                HospitalReview review = new HospitalReview();

                review.setUser(reviewer);
                review.setHospital(hospital);
                review.setRating(rating);
                review.setComment(comment);

                reviewRepository.save(review);

                usedComments.add(comment);
                seededCount++;
                createdForHospital++;
            }

            if (createdForHospital > 0) {
                hospitalsToppedUp++;
            }
        }

        if (seededCount > 0 || !hospitals.isEmpty()) {

            System.out.println();
            System.out.println("==============================================");
            System.out.println("Hospital review seeding complete");
            System.out.println("New reviews created: " + seededCount);
            System.out.println("Hospitals checked: " + hospitals.size());
            System.out.println(
                    "Hospitals topped up to "
                            + MIN_REVIEWS_PER_HOSPITAL
                            + "+ reviews: "
                            + hospitalsToppedUp);
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
                    reviewer.setEmail(email.toLowerCase());
                    reviewer.setPassword(
                            passwordEncoder.encode(SEED_PASSWORD)
                    );
                    reviewer.setRole("USER");
                    reviewer.setEnabled(true);

                    return userRepository.save(reviewer);
                });
    }

    private java.util.Set<String> loadUsedComments(Long hospitalId) {
        try {
            return reviewRepository
                    .findByHospitalIdOrderByCreatedAtDesc(hospitalId)
                    .stream()
                    .map(HospitalReview::getComment)
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            return new java.util.HashSet<>();
        }
    }

    /*
     * Weighted distribution so comparison by user experience
     * is meaningful: mostly 4-5 stars, some 3 stars, and a
     * real share of 1-2 star negative reviews.
     *
     * 5 stars: 30%, 4 stars: 25%, 3 stars: 20%,
     * 2 stars: 15%, 1 star: 10%.
     */
    private int generateBalancedRating() {
        int roll = random.nextInt(100);

        if (roll < 30) {
            return 5;
        }

        if (roll < 55) {
            return 4;
        }

        if (roll < 75) {
            return 3;
        }

        if (roll < 90) {
            return 2;
        }

        return 1;
    }

    private String pickUniqueComment(
            int rating,
            java.util.Set<String> usedComments
    ) {
        List<String> pool = poolForRating(rating);

        List<String> unused = pool.stream()
                .filter(c -> !usedComments.contains(c))
                .toList();

        List<String> source =
                unused.isEmpty() ? pool : unused;

        return source.get(random.nextInt(source.size()));
    }

    private List<String> poolForRating(int rating) {
        return switch (rating) {
            case 5 -> FIVE_STAR_COMMENTS;
            case 4 -> FOUR_STAR_COMMENTS;
            case 3 -> THREE_STAR_COMMENTS;
            case 2 -> TWO_STAR_COMMENTS;
            default -> ONE_STAR_COMMENTS;
        };
    }

    private record ReviewerDef(String email, String name) {
    }
}