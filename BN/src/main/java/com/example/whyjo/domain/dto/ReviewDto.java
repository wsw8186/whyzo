package com.example.whyjo.domain.dto;

import com.example.whyjo.domain.entity.Review;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewDto {
    private Long id;
    private String title;
    private String content;
    private int rating;
    private String userId;
    private Long productId;
    private LocalDateTime createdDate;
    
    public static ReviewDto from(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setTitle(review.getTitle());
        dto.setContent(review.getContent());
        dto.setRating(review.getRating());
        dto.setUserId(review.getUser().getUserId());
        dto.setProductId(review.getProduct().getId());
        dto.setCreatedDate(review.getCreatedDate());
        return dto;
    }
} 