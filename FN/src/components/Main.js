import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/main.css"
import "../css/common/CommonStyles.css";
import "../css/variables.css";
import bg1 from "../img/1.jpg"
import bg2 from "../img/2.jpg"
import bg3 from "../img/3.jpg"
import bg4 from "../img/4.jpg"
import bg5 from "../img/5.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




function Main() {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8090/product/listAll');
                const productsWithImages = response.data.map(product => ({
                    productId: product.id,
                    image: `/product/${product.image}`,
                    info: {
                        name: product.productname,
                        originalPrice: product.price,
                        discount: product.discount,
                        price: product.price * (1 - product.discount/100)
                    }
                }));
                setProducts(productsWithImages);
                console.log(response.data);
                console.log(productsWithImages);
            } catch (error) {
                console.error('상품 데이터를 가져오는데 실패했습니다:', error);
            }
        };

        fetchProducts();
    }, []);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: (
            <div className="slick-next custom-arrow">
                <svg width="52" height="52" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
                        <circle fill-opacity=".2" fill="#000" cx="25" cy="25" r="25"/>
                        <path 
                            d="M22.285 33.699a1 1 0 0 0 1.319.098l.095-.082 8-7.817a1 1 0 0 0 .108-1.306l-.08-.096-7.723-8.182a1 1 0 0 0-1.535 1.276l.08.096 7.049 7.469-7.297 7.13a1 1 0 0 0-.098 1.319l.082.095z" 
                            fill="#FFF" 
                            fill-rule="nonzero"
                        />
                    </g>
                </svg>
            </div>
        ),
        prevArrow: (
            <div className="slick-prev custom-arrow">
                <svg width="52" height="52" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
                        <circle fill-opacity=".2" fill="#000" cx="25" cy="25" r="25"/>
                        <path 
                            d="M27.715 33.699a1 1 0 0 1-1.319.098l-.095-.082-8-7.817a1 1 0 0 1-.108-1.306l.08-.096 7.723-8.182a1 1 0 0 1 1.535 1.276l-.08.096-7.049 7.469 7.297 7.13a1 1 0 0 1 .098 1.319l-.082.095z" 
                            fill="#FFF" 
                            fill-rule="nonzero"
                        />
                    </g>
                </svg>
            </div>
        ),
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const multipleSliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: (
            <div className="main-section-arrow slick-next1 custom-arrow1">
                <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter x="-14%" y="-14%" width="128%" height="128%" filterUnits="objectBoundingBox" id="a">
                            <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>
                            <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/>
                            <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" in="shadowOffsetOuter2" result="shadowMatrixOuter2"/>
                            <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter3"/>
                            <feOffset in="shadowSpreadOuter3" result="shadowOffsetOuter3"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" in="shadowOffsetOuter3" result="shadowMatrixOuter3"/>
                            <feMerge>
                                <feMergeNode in="shadowMatrixOuter1"/>
                                <feMergeNode in="shadowMatrixOuter2"/>
                                <feMergeNode in="shadowMatrixOuter3"/>
                            </feMerge>
                        </filter>
                        <circle id="b" cx="25" cy="25" r="25"/>
                    </defs>
                    <g fill="none" fillRule="evenodd">
                        <g transform="matrix(-1 0 0 1 55 5)">
                            <use fill="#000" filter="url(#a)" href="#b"/>
                            <use fill="#FFF" href="#b"/>
                        </g>
                        <path d="M32.715 38.699a1 1 0 0 1-1.319.098l-.095-.082-8-7.817a1 1 0 0 1-.108-1.306l.08-.096 7.723-8.182a1 1 0 0 1 1.535 1.276l-.08.096-7.049 7.469 7.297 7.13a1 1 0 0 1 .098 1.319l-.082.095z" fill="#333" fillRule="nonzero"/>
                    </g>
                </svg>
            </div>
        ),
        prevArrow: (
            <div className="main-section-arrow slick-prev1 custom-arrow1">
                <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter x="-14%" y="-14%" width="128%" height="128%" filterUnits="objectBoundingBox" id="a">
                            <feOffset in="SourceAlpha" result="shadowOffsetOuter1"/>
                            <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/>
                            <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" in="shadowOffsetOuter2" result="shadowMatrixOuter2"/>
                            <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter3"/>
                            <feOffset in="shadowSpreadOuter3" result="shadowOffsetOuter3"/>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" in="shadowOffsetOuter3" result="shadowMatrixOuter3"/>
                            <feMerge>
                                <feMergeNode in="shadowMatrixOuter1"/>
                                <feMergeNode in="shadowMatrixOuter2"/>
                                <feMergeNode in="shadowMatrixOuter3"/>
                            </feMerge>
                        </filter>
                        <circle id="b" cx="25" cy="25" r="25"/>
                    </defs>
                    <g fill="none" fillRule="evenodd">
                        <g transform="matrix(-1 0 0 1 55 5)">
                            <use fill="#000" filter="url(#a)" href="#b"/>
                            <use fill="#FFF" href="#b"/>
                        </g>
                        <path d="M32.715 38.699a1 1 0 0 1-1.319.098l-.095-.082-8-7.817a1 1 0 0 1-.108-1.306l.08-.096 7.723-8.182a1 1 0 0 1 1.535 1.276l-.08.096-7.049 7.469 7.297 7.13a1 1 0 0 1 .098 1.319l-.082.095z" fill="#333" fillRule="nonzero"/>
                    </g>
                </svg>
            </div>
        )
    };

    // 천 단위 콤마 추가 및 소수점 제거 함수
    //숫자에서 toLocaleString() 사용
    //숫자에 지역화된 형식을 적용하여 천 단위 구분자, 소수점, 통화 등을 자동으로 처리합니다.
    //console.log(number.toLocaleString()); 
    //결과 (예: 브라우저 언어 설정이 한국어일 경우): "1,234,567.89"
    //이지만 깔끔하게 쓰기위해
    const formatPrice = (price) => {
        const integerPrice = Math.floor(price); // 소수점 버림
        return integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const navigate = useNavigate();

    const addToCart = async (productId) => {
        try {
            // 장바구니에 추가
            await axios.post('http://localhost:8090/api/cart/add', {
                productId: productId,
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

    return (
        <div>
            <div className="slide-main">
                <Slider {...sliderSettings}>
                    <div className="slide">
                        <img src={bg1} alt="Slide 1"/>
                    </div>
                    <div className="slide">
                        <img src={bg2} alt="Slide 2"/>
                    </div>
                    <div className="slide">
                        <img src={bg3} alt="Slide 3"/>
                    </div>
                    <div className="slide">
                        <img src={bg4} alt="Slide 4"/>
                    </div>
                </Slider>
            </div>

            <div className="section">
                <div className="section-container">
                    <p className="section-title">🛒지금 가장 많이 담는 특가</p>
                    <p className="section-subtitle">컬리 추천 특가템 최대 40%</p>
                </div>
                <div className="slider-container">
                    <Slider {...multipleSliderSettings}>
                        {products.map((product, index) => (
                            <div key={index} className="product-item">
                                <div className="product-image">
                                    <a href={`/product/${product.productId}`} className="product-link">
                                        <img src={product.image} alt={product.info.name} />
                                    </a>
                                </div>
                                <button 
                                    className="cart-button"
                                    onClick={() => addToCart(product.productId)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.5 1.5H3.16667L3.33333 2.5M3.33333 2.5L4.83333 11.5H14.5L16 2.5H3.33333Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    담기
                                </button>
                                <a href={`/product/${product.productId}`} className="product-link">
                                    <div className="product-info">
                                        <h3>{product.info.name}</h3>
                                        <div className="price-info">
                                            <div className="original-price">
                                                {formatPrice(product.info.originalPrice)}원
                                            </div>
                                            <div className="price-wrap">
                                                <span className="discount">{product.info.discount}%</span>
                                                <span className="price">{formatPrice(product.info.price)}원</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="section">
                <div className="section-container">
                    <p className="section-title">🥇2024 명예의 전당</p>
                    <p className="section-subtitle">최고 인기 상품 할인가로 만나보세요!</p>
                </div>
                <div className="slider-container">
                    <Slider {...multipleSliderSettings}>
                        {products.map((product, index) => (
                            <div key={index} className="product-item">
                                <div className="product-image">
                                    <a href={`/product/${product.productId}`} className="product-link">
                                        <img src={product.image} alt={product.info.name} />
                                    </a>
                                </div>
                                <button 
                                    className="cart-button"
                                    onClick={() => addToCart(product.productId)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.5 1.5H3.16667L3.33333 2.5M3.33333 2.5L4.83333 11.5H14.5L16 2.5H3.33333Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    담기
                                </button>
                                <a href={`/product/${product.productId}`} className="product-link">
                                    <div className="product-info">
                                        <h3>{product.info.name}</h3>
                                        <div className="price-info">
                                            <div className="price-wrap">
                                                <span className="discount">{product.info.discount}%</span>
                                                <span className="price">{formatPrice(product.info.price)}원</span>
                                            </div>
                                            <div className="original-price">
                                                {formatPrice(product.info.originalPrice)}원
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="center-image">
                <img src={bg5} alt="bg5"/>
            </div>

            <div className="section">
                <div className="section-container">
                    <p className="section-title">👑2024 신상품 베스트</p>
                    <p className="section-subtitle">올해 입점한 상품 중 가장 많이 사랑 받았어요</p>
                </div>
                <div className="slider-container">
                    <Slider {...multipleSliderSettings}>
                        {products.map((product, index) => (
                            <div key={index} className="product-item">
                                <div className="product-image">
                                    <a href={`/product/${product.productId}`} className="product-link">
                                        <img src={product.image} alt={product.info.name} />
                                    </a>
                                </div>
                                <button 
                                    className="cart-button"
                                    onClick={() => addToCart(product.productId)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.5 1.5H3.16667L3.33333 2.5M3.33333 2.5L4.83333 11.5H14.5L16 2.5H3.33333Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    담기
                                </button>
                                <a href={`/product/${product.productId}`} className="product-link">
                                    <div className="product-info">
                                        <h3>{product.info.name}</h3>
                                        <div className="price-info">
                                            <div className="price-wrap">
                                                <span className="discount">{product.info.discount}%</span>
                                                <span className="price">{formatPrice(product.info.price)}원</span>
                                            </div>
                                            <div className="original-price">
                                                {formatPrice(product.info.originalPrice)}원
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Main;