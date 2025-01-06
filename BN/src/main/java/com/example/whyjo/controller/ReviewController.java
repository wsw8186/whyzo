package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.ReviewDto;
import com.example.whyjo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        ReviewDto created = reviewService.createReview(reviewDto, userDetails.getUsername());
        return ResponseEntity.ok(created);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ReviewDto>> getUserReviews(@AuthenticationPrincipal UserDetails userDetails) {
        List<ReviewDto> reviews = reviewService.getUserReviews(userDetails.getUsername());
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(@PathVariable Long reviewId,
                                           @RequestBody ReviewDto reviewDto) {
        reviewService.updateReview(reviewId, reviewDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
} 