package com.medicompare.review.controller;

import com.medicompare.review.dto.CreateReviewRequest;
import com.medicompare.review.dto.ReviewResponse;
import com.medicompare.review.dto.ReviewSummaryResponse;
import com.medicompare.review.entity.HospitalReview;
import com.medicompare.review.service.HospitalReviewService;
import com.medicompare.user.entity.User;
import com.medicompare.user.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class HospitalReviewController {

    private final HospitalReviewService reviewService;
    private final UserRepository userRepository;

    public HospitalReviewController(
            HospitalReviewService reviewService,
            UserRepository userRepository
    ) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    /*
     * =========================================================
     * GET ALL REVIEWS FOR A HOSPITAL
     * =========================================================
     */

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<ReviewResponse>> getHospitalReviews(
            @PathVariable Long hospitalId
    ) {

        List<ReviewResponse> reviews =
                reviewService
                        .getHospitalReviews(hospitalId)
                        .stream()
                        .map(ReviewResponse::from)
                        .toList();

        return ResponseEntity.ok(reviews);
    }


    /*
     * =========================================================
     * GET REVIEW SUMMARY
     *
     * Returns:
     *
     * average rating
     * total reviews
     * 1-5 star distribution
     * =========================================================
     */

    @GetMapping("/hospital/{hospitalId}/summary")
    public ResponseEntity<ReviewSummaryResponse> getReviewSummary(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                reviewService.getReviewSummary(
                        hospitalId
                )
        );
    }


    /*
     * =========================================================
     * CREATE REVIEW
     * =========================================================
     */

    @PostMapping("/hospital/{hospitalId}")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long hospitalId,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {

        User user =
                getAuthenticatedUser(authentication);

        HospitalReview review =
                reviewService.createReview(
                        user.getId(),
                        hospitalId,
                        request.getRating(),
                        request.getComment()
                );

        return ResponseEntity.ok(
                ReviewResponse.from(review)
        );
    }


    /*
     * =========================================================
     * UPDATE REVIEW
     * =========================================================
     */

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {

        User user =
                getAuthenticatedUser(authentication);

        HospitalReview review =
                reviewService.updateReview(
                        user.getId(),
                        reviewId,
                        request.getRating(),
                        request.getComment()
                );

        return ResponseEntity.ok(
                ReviewResponse.from(review)
        );
    }


    /*
     * =========================================================
     * DELETE REVIEW
     * =========================================================
     */

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication
    ) {

        User user =
                getAuthenticatedUser(authentication);

        reviewService.deleteReview(
                user.getId(),
                reviewId
        );

        return ResponseEntity.noContent()
                .build();
    }


    /*
     * =========================================================
     * AUTHENTICATED USER
     * =========================================================
     */

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        if (
                authentication == null ||
                authentication.getName() == null
        ) {

            throw new IllegalStateException(
                    "User is not authenticated."
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found."
                        )
                );
    }
}