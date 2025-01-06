import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/common/ProductList.css';
import '../../css/common/CommonStyles.css';
import '../../css/variables.css';
import bg5 from '../../img/5.png';

function ProductListAll() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState('original');
    const itemsPerPage = 9;

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8090/product/listAll');
            console.log(response.data);

            if (Array.isArray(response.data)) {
                const processedProducts = response.data.map(product => ({
                    ...product,
                    originalPrice: product.price,
                    price: product.price * (1 - product.discount/100)
                }));
                setProducts(processedProducts);
            } else {
                setProducts([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || '상품 정보를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const addToCart = async (product) => {
        try {
            // 장바구니에 추가
            await axios.post('http://localhost:8090/api/cart/add', {
                productId: product.id,
                productName: product.productname,
                subTitle: product.subtitle || '',  // 상품 설명
                productType: product.type || '냉장', // 상품 타입
                quantity: 1,
                price: product.price,
                productImage: product.image[0]  // 상품 이미지
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const formatPrice = (price) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0';
        }
    
        const integerPrice = Math.floor(price);
        return integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const getSortedProducts = (products, sortType) => {
        const sortedProducts = [...products];
        
        switch(sortType) {
            case 'original':
                return sortedProducts;
            case 'newest':
                return sortedProducts.sort((a, b) => b.id - a.id);
            case 'priceLow':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'priceHigh':
                return sortedProducts.sort((a, b) => b.price - a.price);
            default:
                return sortedProducts;
        }
    };

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const sortedProducts = getSortedProducts(products, sortType);
    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (type) => {
        setSortType(type);
        setCurrentPage(1);
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="list-page">
            <div className="top-image">
                <img src={bg5} alt="bg5"/>
            </div>
            <div className='list-container'>
                <h2>상품 목록</h2>
                <div className='list-filter'>
                    <a href='#'>인기신상랭킹</a>
                    <a href='#'>입점특가</a>
                    <a href='#'>요즘간식</a>
                    <a href='#'>간편한끼</a>
                </div>
                <div className='list-sort'>
                    <div className='list-sort-count'><p>총 {products.length}개</p></div>
                    <div className='list-sort-buttons'>
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
                <div className='list-items'>
                    {currentProducts.map((product, index) => (
                        <div key={index} className="list-product-item">
                            <a href={`/product/${product.id}`} className="list-product-link">
                                <div className="list-product-image">
                                    <img src={`/product/${product.image[0]}`} alt={product.productname} />
                                </div>
                            </a>
                            <button 
                                className="list-cart-button"
                                onClick={() => addToCart(product)}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 1.5H3.16667L3.33333 2.5M3.33333 2.5L4.83333 11.5H14.5L16 2.5H3.33333Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                담기
                            </button>
                            <a href={`/product/${product.id}`} className="list-product-link">
                                <div className="list-product-info">
                                    <h3>{product.productname}</h3>
                                    <div className="list-price-info">
                                        <div className="list-original-price">
                                            {formatPrice(product.originalPrice)}원
                                        </div>
                                        <div className="list-price-wrap">
                                            <span className="list-discount">{product.discount}%</span>
                                            <span className="list-price">{formatPrice(product.price)}원</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
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
            </div>
        </div>
    );
}

export default ProductListAll;