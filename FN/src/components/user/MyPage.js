import React, { useState, useEffect } from 'react';
import '../../css/user/MyPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function MyPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 5;
    const [activeTab, setActiveTab] = useState('orders');
    const [editingReview, setEditingReview] = useState(null);

    // 로그인 상태 체크
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true
                });
                if (!response.data.isAuthenticated) {
                    console.log('로그인 되지 않은 상태');
                    navigate('/user/login');
                }
            } catch (error) {
                navigate('/user/login');
            }
        };

        checkLoginStatus();
    }, [navigate]);

    // 주문 목록 가져오기
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/orders/my-orders`, {
                    withCredentials: true
                });
                
                if (Array.isArray(response.data)) {
                    // 중복 제거를 위해 Map 사용
                    const uniqueOrders = new Map();
                    
                    response.data.forEach(order => {
                        const key = `${order.orderId}_${order.productId}`; // 주문ID와 상품ID로 고유키 생성
                        if (!uniqueOrders.has(key)) {
                            uniqueOrders.set(key, {
                                id: order.orderId,
                                productId: order.productId,
                                productName: order.productName,
                                price: order.price,
                                quantity: order.quantity,
                                date: new Date(order.orderDate).toLocaleDateString(),
                                image: order.productImage,
                                status: order.orderStatus,
                                totalPrice: order.totalPrice
                            });
                        }
                    });
                    
                    setOrders(Array.from(uniqueOrders.values()));
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error('주문 목록 조회 에러:', error.response || error);
                setOrders([]);
            }
        };

        fetchOrders();
    }, []);

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:8090/api/reviews/user', {
                withCredentials: true
            });
            setReviews(response.data);
        } catch (error) {
            console.error('리뷰 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const filteredOrders = orders
        .filter((order) => {
            const searchTermWords = searchTerm.toLowerCase().trim().split(/\s+/);
            const productNameWords = order.productName.toLowerCase().trim().split(/\s+/);
            
            return searchTermWords.every(searchWord => 
                productNameWords.some(nameWord => 
                    nameWord.includes(searchWord) || searchWord.includes(nameWord)
                )
            );
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // // 디버깅을 위한 로그 추가
    // console.log('전체 주문 수:', orders.length);
    // console.log('필터링된 주문 수:', filteredOrders.length);
    // console.log('현재 페이지 아이템 수:', currentItems.length);
    // console.log('현재 페이지:', currentPage);
    // console.log('총 페이지 수:', totalPages);

    // 페이지 변경 함수 추가
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // 페이지 변경 시 맨 위로 스크롤
        window.scrollTo(0, 0);
    };

    const handleTrackDelivery = (orderId) => {
        console.log(`배송 조회: ${orderId}`);
    };

    const handleWriteReview = (order) => {
        setSelectedProduct({
            id: order.productId,
            name: order.productName
        });
        setShowReviewForm(true);
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            if (editingReview) {
                await axios.put(`http://localhost:8090/api/reviews/${editingReview.id}`, reviewData, {
                    withCredentials: true
                });
            } else {
                await axios.post('http://localhost:8090/api/reviews', {
                    ...reviewData,
                    productId: selectedProduct.id
                }, {
                    withCredentials: true
                });
            }
            setShowReviewForm(false);
            setSelectedProduct(null);
            setEditingReview(null);
            fetchReviews();
        } catch (error) {
            console.error('리뷰 저장 실패:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:8090/api/reviews/${reviewId}`, {
                withCredentials: true
            });
            fetchReviews();
        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
        }
    };

    // 리뷰 작성 부 확인을 위한 함수 추가
    const hasReviewForProduct = (productId) => {
        return reviews.some(review => review.productId === productId);
    };

    // 검색어 변경 핸들러 추가
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // 검색어가 변경될 때마다 1페이지로 리셋
    };

    return (
        <div className="mypage-container">
            <div className="tab-buttons">
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    주문 목록
                </button>
                <button 
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    리뷰 목록
                </button>
            </div>

            {activeTab === 'orders' && (
                <div className="mypage-container">
                    <h1>주문 목록</h1>

                    <div className="mypage-search-container">
                        <input
                            type="text"
                            placeholder="주문한 상품을 검색할 수 있어요!"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mypage-search-input"
                        />
                    </div>

                    <div className="mypage-orders-container">
                        {currentItems.length > 0 ? (
                            currentItems.map((order) => (
                                <div key={`${order.id}_${order.productId}`} className="mypage-order-item">
                                    <div className="mypage-order-date">
                                        {order.date}
                                    </div>
                                    <div className="mypage-content-wrapper">
                                        <div className="mypage-image-container">
                                            <a href={`/product/${order.productId}`}>
                                                <img src={order.image} alt={order.productName} className="mypage-product-image"/>
                                            </a>
                                            <span className="mypage-status-badge">{order.status}</span>
                                        </div>
                                        <a href={`/product/${order.productId}`}>
                                            <div className="mypage-order-info">
                                                <h3>{order.productName}</h3>
                                                <p className="mypage-price">
                                                    {order.price.toLocaleString()}원
                                                </p>
                                                <p className="mypage-quantity">
                                                    수량: {order.quantity}개
                                                </p>
                                            </div>
                                        </a>  
                                    </div>
                                    <div className="mypage-order-buttons">
                                        <button
                                            onClick={() => handleTrackDelivery(order.id)}
                                            className="mypage-track-button"
                                        >
                                            배송조회
                                        </button>
                                        {!hasReviewForProduct(order.productId) && (  // 리뷰가 없는 경에만 버튼 표시
                                            <button
                                                onClick={() => handleWriteReview({
                                                    productId: order.productId,
                                                    productName: order.productName
                                                })}
                                                className="mypage-review-button"
                                            >
                                                리뷰작성
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="mypage-no-orders">
                                <p>주문 내역이 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="mypage-pagination">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="reviews-container">
                    <ReviewList 
                        reviews={reviews} 
                        onDeleteReview={handleDeleteReview}
                        onEditReview={handleEditReview}
                    />
                </div>
            )}

            {showReviewForm && (
                <ReviewForm
                    productName={selectedProduct?.name}
                    initialData={editingReview}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => {
                        setShowReviewForm(false);
                        setSelectedProduct(null);
                        setEditingReview(null);
                    }}
                />
            )}
        </div>
    );
}

export default MyPage;
