import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/common/ProductDetail.css';
import '../../css/common/CommonStyles.css';
import '../../css/variables.css';
import { useNavigate } from 'react-router-dom';
import checkPoint from '../../img/checkpoint.jpg';
import axios from 'axios';

function ProductDetail() {
    const { id } = useParams();
    const [amount, setAmount] = useState(1);
    const [product, setProduct] = useState({
        id: '',
        name: '',
        subTitle: '',
        price: 0,
        originalPrice: 0,
        discount: 0,
        type: '',
        unit: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/product/listId/${id}`);
                const productData = response.data;
                
                // 할인된 가격 계산
                const discountedPrice = productData.price * (1 - productData.discount/100);
                
                setProduct({
                    ...productData,
                    originalPrice: productData.price,
                    price: discountedPrice
                });
                
                setProductId(productData.id);
            } catch (error) {
                console.error('상품 정보 로딩 실패:', error);
                alert('상품 정보를 불러오는데 실패했습니다.');
                navigate('/');
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id, navigate]);

    const [productId, setProductId] = useState('');

    const addToCart = async (productId) => {
        try {
            await axios.post('http://localhost:8090/api/cart/add', {
                productId: productId,
                quantity: amount
            }, {
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            
            alert('상품이 장바구니에 추가되었습니다.');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/user/login');
            } else {
                console.error('장바구니 추가 실패:', error);
                alert('장바구니 추가 실패');
            }
        }
    };

    const buyNow = async (productId) => {
        try {
            // 장바구니에 추가
            await axios.post('http://localhost:8090/api/cart/add', {
                productId: productId,
                quantity: amount
            }, {
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
            
            // 장바구니 페이지로 이동
            navigate('/user/cart');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/user/login');
            } else {
                console.error('주문 실패:', error);
                alert('주문 처리 중 오류가 발생했습니다.');
            }
        }
    };

    // 후기와 문의 데이터 상태 관리
    const [reviews, setReviews] = useState([]);

    // 리뷰 목록 가져오기 함수 수정
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/reviews/product/${id}`);  // withCredentials 제거
                console.log(response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('리뷰 목록 조회 실패:', error);
                setReviews([]); // 에러 발생 시 빈 배열로 설정
            }
        };

        if (id) {
            fetchReviews();
        }
    }, [id]);

    const [inquiries] = useState([
        { id: 1, title: "배송 문의", content: "언제 배송되나요?" },
        { id: 2, title: "재입고 문의", content: "재입고 일정 알 수 있을까요?" },
        { id: 3, title: "상품 문의", content: "유통기한이 어떻게 되나요?" },
        { id: 4, title: "포장 문의", content: "선물용으로 포장 가능한가요?" },
        { id: 5, title: "포장 문의2", content: "선물용으로 포장 가능한가요2?" },
        { id: 6, title: "포장 문의3", content: "선물용으로 포장 가능한가요3?" }
    ]);

    // 페이지네이션 관련 상태 수정
    const [reviewPage, setReviewPage] = useState(1);
    const itemsPerPage = 5; // 한 페이지당 보여줄 리뷰 수 증가

    // 현재 페이지에 표시할 리뷰 계산 로직 수정
    const indexOfLastReview = reviewPage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalReviewPages = Math.ceil(reviews.length / itemsPerPage);

    // 페이지 변경 핸들러
    const handleReviewPage = (page) => {
        setReviewPage(page);
    };

    // 문의 관련 상태 추가
    const [inquiryPage, setInquiryPage] = useState(1);
    const inquiryItemsPerPage = 5;

    // 문의 페이지네이션 계산
    const indexOfLastInquiry = inquiryPage * inquiryItemsPerPage;
    const indexOfFirstInquiry = indexOfLastInquiry - inquiryItemsPerPage;
    const currentInquiries = inquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);
    const totalInquiryPages = Math.ceil(inquiries.length / inquiryItemsPerPage);

    // 페이지 변경 핸들러 수정
    const handleInquiryPage = (page) => {
        setInquiryPage(page);
    };

    // 수량 변경 핸들러
    const handleAmountChange = (change) => {
        const newAmount = Math.max(1, amount + change);
        setAmount(newAmount);
    };

    // 천 단위 콤마 추가 및 소수점 제거 함수
    const formatPrice = (price) => {
        const integerPrice = Math.floor(price); // 소수점 버림
        return integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 총 상품 금액 계산
    const totalPrice = product.price * amount;

    // 스크롤 핸들러 추가
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <div className="product-detail-left">
                    <div className="product-detail-image">
                        <img src={`/product/${product.image}`} alt={product.name} />
                    </div>
                </div>
                <div className="product-detail-right">
                    <div className="product-info">
                        <div className="delivery-type">{product.type}</div>
                        <h2>{product.productname}</h2>
                        <p className="product-subTitle">{product.subtitle}</p>
                        
                        <div className="price-info-detail">
                            <div className="price-wrap">
                                <span className="discount">{product.discount}%</span>
                                <span className="price">{formatPrice(product.price)}원</span>
                            </div>
                            <div className="original-price">
                                {formatPrice(product.originalPrice)}원
                            </div>
                        </div>

                        <div className="product-options">
                           <p>{product.unit}</p>
                           <p>{product.description}</p>
                        </div> 

                        <div className="amount-control">
                            <button onClick={() => handleAmountChange(-1)}>-</button>
                            <span>{amount}</span>
                            <button onClick={() => handleAmountChange(1)}>+</button>
                        </div>

                        <div className="total-price">
                            <span>총 상품금액:</span>
                            <span className="total">{formatPrice(totalPrice)}원</span>
                        </div>

                        <div className="button-group">
                            <button className="detail-cart-button" onClick={() => addToCart(product.id)}>장바구니 담기</button>
                            <button className="detail-buy-button" onClick={() => buyNow(product.id)}>바로 구매</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-detail-tabs">
                <div className="tab-buttons">
                    <button 
                        className="tab-button active"
                        onClick={() => scrollToSection('product-description')}
                    >
                        상품설명
                    </button>
                    <button 
                        className="tab-button"
                        onClick={() => scrollToSection('product-reviews')}
                    >
                        후기 ({reviews.length})
                    </button>
                    <button 
                        className="tab-button"
                        onClick={() => scrollToSection('product-inquiries')}
                    >
                        문의
                    </button>
                </div>
            </div>

            <div id="product-description" className="product-detail-main">
                <h4>{product.subtitle}</h4>
                <h1>{product.productname}</h1>
                <hr/>
                <span>{product.description}</span>
                <hr/>
                <h1>Kurly's Check Point</h1>
                <img src={checkPoint} alt="checkPoint"/>
            </div>

            <div id="product-reviews" className="product-reviews">
                <div className="review-header">
                    <h3>상품 후기 ({reviews.length})</h3>
                </div>
                <div className="review-notice">
                    <p>• 상품에 대한 후기를 남기는 공간입니다.</p>
                    <p>• 배송관련, 주문(취소/교환/반불)관련 문의 및 요청사항은 문의하기를 이용해주세요.</p>
                </div>
                <div className="review-list">
                    {reviews.length > 0 ? (
                        currentReviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-item-header">
                                    <div className="review-title-rating">
                                        <span className="review-item-title">{review.title}</span>
                                        <span className="review-rating">{'★'.repeat(review.rating)}</span>
                                    </div>
                                    <div className="review-info">
                                        <span className="review-author">
                                            {review.userId.substring(0, 3)}{'*'.repeat(review.userId.length - 3)}
                                        </span>
                                        <span className="review-item-date">
                                            {new Date(review.createdDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="review-item-content">{review.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-reviews">
                            <p>등록된 후기가 없습니다.</p>
                        </div>
                    )}
                </div>
                <div className="pagination">
                    <button 
                        className={`page-button ${reviewPage <= 1 ? 'disabled' : ''}`}
                        onClick={() => reviewPage > 1 && handleReviewPage(reviewPage - 1)}
                        disabled={reviewPage <= 1}
                    >
                        ←
                    </button>
                    <span className="current-page">{reviewPage} / {totalReviewPages}</span>
                    <button 
                        className={`page-button ${reviewPage >= totalReviewPages ? 'disabled' : ''}`}
                        onClick={() => reviewPage < totalReviewPages && handleReviewPage(reviewPage + 1)}
                        disabled={reviewPage >= totalReviewPages}
                    >
                        →
                    </button>
                </div>
            </div>

            <div id="product-inquiries" className="product-inquiries">
                <div className="inquiry-header">
                    <h3>상품 문의 ({inquiries.length})</h3>
                    <button className="write-inquiry">문의하기</button>
                </div>
                <div className="inquiry-notice">
                    <p>• 상품에 대한 문의를 남기는 공간입니다.</p>
                </div>
                <div className="inquiry-list">
                    {currentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="inquiry-item">
                            <div className="inquiry-item-header">
                                <span className="inquiry-item-title">{inquiry.title}</span>
                                <span className="inquiry-item-date">2024.01.10</span>
                            </div>
                            <p className="inquiry-item-content">{inquiry.content}</p>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button 
                        className={`page-button ${inquiryPage <= 1 ? 'disabled' : ''}`}
                        onClick={() => inquiryPage > 1 && handleInquiryPage(inquiryPage - 1)}
                        disabled={inquiryPage <= 1}
                    >
                        ←
                    </button>
                    <span className="current-page">{inquiryPage} / {totalInquiryPages}</span>
                    <button 
                        className={`page-button ${inquiryPage >= totalInquiryPages ? 'disabled' : ''}`}
                        onClick={() => inquiryPage < totalInquiryPages && handleInquiryPage(inquiryPage + 1)}
                        disabled={inquiryPage >= totalInquiryPages}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;