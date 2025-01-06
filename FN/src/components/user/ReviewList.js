import React from 'react';

const ReviewList = ({ reviews, onDeleteReview, onEditReview }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="review-list">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <h3>{review.title}</h3>
              <div className="review-rating">{renderStars(review.rating)}</div>
            </div>
            <div className="review-content">{review.content}</div>
            <div className="review-footer">
              <span className="review-date">{formatDate(review.createdDate)}</span>
              <div className="review-actions">
                <button 
                  className="review-edit-button"
                  onClick={() => onEditReview(review)}
                >
                  수정
                </button>
                <button 
                  className="review-delete-button"
                  onClick={() => onDeleteReview(review.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{
          textAlign: 'center',
        }}>
          <p>작성한 리뷰가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList; 