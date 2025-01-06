import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/common/SearchResults.css';
import '../../css/common/CommonStyles.css';
import '../../css/variables.css';
import '../../css/common/ProductList.css';


function SearchResults() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    const navigate = useNavigate();
    const [sortType, setSortType] = useState('original');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8090/product/search?keyword=${encodeURIComponent(keyword)}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('검색 결과를 가져오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        if (keyword) {
            fetchSearchResults();
        }
    }, [keyword]);


    const addToCart = async (id) => {
        try {
            await axios.post('http://localhost:8090/api/cart/add', {
                productId: id,
                quantity: 1
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

    const getSortedProducts = (products, sortType) => {
        const sortedProducts = [...products];
        
        switch(sortType) {
            case 'original':
                return sortedProducts;
            case 'newest':
                return sortedProducts.sort((a, b) => b.id - a.id);
            case 'priceLow':
                return sortedProducts.sort((a, b) => 
                    (a.price * (1 - a.discount/100)) - (b.price * (1 - b.discount/100))
                );
            case 'priceHigh':
                return sortedProducts.sort((a, b) => 
                    (b.price * (1 - b.discount/100)) - (a.price * (1 - a.discount/100))
                );
            default:
                return sortedProducts;
        }
    };


    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0';
        }
    
        const integerPrice = Math.floor(price);
        return integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    //페이지네이션
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    const sortedProducts = getSortedProducts(searchResults, sortType);
    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (type) => {
        setSortType(type);
        setCurrentPage(1);
    };

    if (loading) return <div>검색 중...</div>;

    return (
        <div className="search-results-container">
            <div className="list-container">
                <h2>'{keyword}' 검색 결과</h2>
                <div className='product-list-sort'>
                    <div className='product-list-sort-count'>
                        <p>총 {searchResults.length}개</p>
                    </div>
                    <div className='product-list-sort-buttons'>
                        <a href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleSort('newest');
                            }}
                            className={sortType === 'newest' ? 'active' : ''}
                        >
                            신상품순
                        </a> |
                        <a href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleSort('priceLow');
                            }}
                            className={sortType === 'priceLow' ? 'active' : ''}
                        >
                            낮은가격순
                        </a> |
                        <a href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleSort('priceHigh');
                            }}
                            className={sortType === 'priceHigh' ? 'active' : ''}
                        >
                            높은가격순
                        </a>
                    </div>
                </div>
                {searchResults.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                ) : (
                    <>
                        <div className="product-list-items">
                            {currentProducts.map((product, index) => (
                                <div key={index} className="product-item">
                                    <div className="product-content">
                                        <a href={`/product/${product.id}`} className="product-link">
                                            <div className="product-image">
                                                <img src={`/product/${product.image[0]}`} alt={product.productname} />
                                            </div>
                                        </a>
                                        <button 
                                            className="cart-button"
                                            onClick={() => addToCart(product.id)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.5 1.5H3.16667L3.33333 2.5M3.33333 2.5L4.83333 11.5H14.5L16 2.5H3.33333Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            담기
                                        </button>
                                        <a href={`/product/${product.id}`} className="product-link">
                                            <div className="product-info">
                                                <h3>{product.productname}</h3>
                                                <div className="price-info">
                                                    <div className="original-price">
                                                        {formatPrice(product.price)}원
                                                    </div>
                                                    <div className="price-wrap">
                                                        <span className="discount">{product.discount}%</span>
                                                        <span className="price">
                                                            {formatPrice(product.price * (1 - product.discount / 100))}원
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="list-pagination">
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="list-page-button"
                                >
                                    ←
                                </button>
                            )}

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`list-page-button ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="list-page-button"
                                >
                                    →
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchResults;