import React, { useState, useEffect } from 'react';

const ReviewForm = ({ productName, initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setRating(initialData.rating);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      title,
      content,
      rating,
      productId: initialData?.productId
    });
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form">
        <h2>{initialData ? '리뷰 수정' : `${productName} 리뷰 작성`}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>별점</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="5"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">
              {initialData ? '수정' : '등록'}
            </button>
            <button type="button" className="submit-button" onClick={onCancel}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 