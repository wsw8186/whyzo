package com.example.whyjo.service;


import com.example.whyjo.domain.dto.ReviewDto;
import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.domain.entity.Review;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.ProductRepository;
import com.example.whyjo.domain.repository.ReviewRepository;
import com.example.whyjo.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReviewDto createReview(ReviewDto reviewDto, String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        Product product = productRepository.findById(reviewDto.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setTitle(reviewDto.getTitle());
        review.setContent(reviewDto.getContent());
        review.setRating(reviewDto.getRating());
        review.setUser(user);
        review.setProduct(product);
        
        Review savedReview = reviewRepository.save(review);
        return ReviewDto.from(savedReview);
    }

    public List<ReviewDto> getUserReviews(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        return reviewRepository.findByUserOrderByCreatedDateDesc(user)
            .stream()
            .map(ReviewDto::from)
            .collect(Collectors.toList());
    }

    public List<ReviewDto> getProductReviews(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        return reviewRepository.findByProduct_IdOrderByCreatedDateDesc(productId)
            .stream()
            .map(ReviewDto::from)
            .collect(Collectors.toList());
    }

    public void updateReview(Long reviewId, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));
            
        review.setTitle(reviewDto.getTitle());
        review.setContent(reviewDto.getContent());
        review.setRating(reviewDto.getRating());
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
} 