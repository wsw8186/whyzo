import React, { useState, useEffect } from 'react';
import "../../css/user/Cart.css"
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // 장바구니 아이템 불러오기
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:8090/api/cart', {
                withCredentials: true
            });
            console.log('서버 응답 데이터:', response.data); // 데이터 구조 확인
            
            // 서버에서 받은 데이터를 Cart 컴포넌트의 형식에 맞게 변환
            const transformedItems = response.data.map(item => ({
                id: item.id,
                productId: item.productId, // product.id 대신 productId 사용
                name: item.productName,
                option: item.subTitle,
                price: item.price,
                type: item.productType,
                amount: item.quantity,
                image: `/product/${item.productImage}`  
            }));

            setCartItems(transformedItems);
        } catch (error) {
            if (error.response?.status === 401) {
                setIsLoggedIn(false);
                navigate('/user/login');
            } else {
                console.error('장바구니 조회 실패:', error);
            }
        }
    };

    // 전체 선택 처리 함수
    const SelectAll = () => {
        if (!isAllSelected) {
            setIsAllSelected(true);
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setIsAllSelected(false);
            setSelectedItems([]);
        }
    };

    // 개별 아이템 선택 처리 함수
    const handleItemSelect = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                const newSelected = prev.filter(id => id !== itemId);
                setIsAllSelected(false);
                return newSelected;
            } else {
                const newSelected = [...prev, itemId];
                if (newSelected.length === cartItems.length) {
                    setIsAllSelected(true);
                }
                return newSelected;
            }
        });
    };

    // 수량 변경 함수
    const handleAmountChange = async (itemId, change) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId) {
                const newAmount = Math.max(1, item.amount + change);
                return { ...item, amount: newAmount };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    // 선택된 상품들의 총 금액 계산
    const totalPrice = selectedItems.reduce((sum, itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        return sum + (item ? item.price * item.amount : 0);
    }, 0);

    // 배송비 계산 로직을 상수로 분리
    const FREE_SHIPPING_THRESHOLD = 30000;
    const SHIPPING_FEE = 3000;

    // 최종 결제 금액
    const finalPrice = totalPrice + (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE);

    // 구매 처리 함수 수정
    const handlePurchase = async () => {
        try {
            // 선택된 상품들만 필터링
            const purchaseItems = cartItems
                .filter(item => selectedItems.includes(item.id))
                .map(item => ({
                    productId: item.productId,
                    productName: item.name,
                    amount: item.amount,
                    price: item.price,
                    totalPrice: item.price * item.amount
                }));
            console.log(purchaseItems);

            // 상품 총액 계산
            const itemsTotal = purchaseItems.reduce((sum, item) => sum + item.totalPrice, 0);
            
            // 배송비 계산
            const shippingFee = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
            const finalAmount = itemsTotal + shippingFee;

            // 결제 전 배송비 안내
            if (shippingFee > 0) {
                const remainForFree = FREE_SHIPPING_THRESHOLD - itemsTotal;
                alert(`배송비 ${shippingFee.toLocaleString()}원이 추가됩니다.\n${remainForFree.toLocaleString()}원 더 구매 시 무료배송!`);
            }

            // 사용자 정보 조회
            const userResponse = await axios.get('http://localhost:8090/api/auth/check', {
                withCredentials: true
            });

            if (!userResponse.data.isAuthenticated) {
                alert('로그인이 필요합니다.');
                window.location.href = '/user/login';
                return;
            }

            const userId = userResponse.data.userId;

            // 포트원 결제 요청
            const { IMP } = window;
            IMP.init("");

            const data = {
                channelKey: "",
                pay_method: "card",
                merchant_uid: `order_${new Date().getTime()}_${Math.random().toString(36).substr(2,9)}`,
                amount: finalAmount, // 배송비 포함된 최종 금액
                currency: "KRW",
                name: purchaseItems.length > 1 
                    ? `${purchaseItems[0].productName} 외 ${purchaseItems.length - 1}건`
                    : purchaseItems[0].productName,
                buyer_tel: userResponse.data.phoneNumber || "",
                buyer_email: userResponse.data.email || "",
                buyer_addr: userResponse.data.address || ""
            };

            IMP.request_pay(data, async response => {
                if (response.success) {
                    try {
                        const orderData = {
                            userId: userId,
                            orderItems: purchaseItems,
                            totalAmount: itemsTotal,
                            shippingFee: shippingFee,
                            orderDate: new Date().toISOString(),
                            impUid: response.imp_uid,
                            merchantUid: response.merchant_uid,
                            paymentStatus: "PAID"
                        };

                        const serverResponse = await axios.post(
                            'http://localhost:8090/api/orders',
                            orderData,
                            { withCredentials: true }
                        );

                        if (serverResponse.status === 200 || serverResponse.status === 201) {
                            // 주문 완료된 상품들 장바구니에서 삭제
                            for (const itemId of selectedItems) {
                                try {
                                    await axios.delete(`http://localhost:8090/api/cart/${itemId}`, {
                                        withCredentials: true
                                    });
                                } catch (error) {
                                    console.error('장바구니 항목 삭제 실패:', error);
                                }
                            }

                            alert('주문이 완료되었습니다.');
                            // 장바구니 목록 새로고침
                            fetchCartItems();
                            setSelectedItems([]);
                            setIsAllSelected(false);
                        }
                    } catch (error) {
                        console.error('주문 처리 중 오류 발생:', error);
                        alert('주문 처리 중 오류가 발생했습니다.');
                    }
                } else {
                    alert(`결제 실패: ${response.error_msg}`);
                }
            });

        } catch (error) {
            console.error('결제 처리 중 오류 발생:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

    // 버튼 클릭 핸들러 수정
    const handleButtonClick = () => {
        if (!isLoggedIn) {
            window.location.href = '/user/login';
        } else {
            if (selectedItems.length === 0) {
                alert('구매할 상품을 선택해주세요.');
                return;
            }
            handlePurchase();
        }
    };

    // 전체 삭제 처리 함수 수정
    const handleDeleteAll = async () => {
        try {
            // 모든 아이템 삭제
            for (const item of cartItems) {
                await axios.delete(`http://localhost:8090/api/cart/${item.id}`, {
                    withCredentials: true
                });
            }
            
            // UI 업데이트
            setCartItems([]);
            setSelectedItems([]);
            setIsAllSelected(false);
            
            alert('장바구니가 비워졌습니다.');
        } catch (error) {
            console.error('상품 삭제 실패:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 선택 삭제 처리 함수 추가
    const handleDeleteSelected = async () => {
        try {
            if (selectedItems.length === 0) {
                alert('삭제할 상품을 선택해주세요.');
                return;
            }

            // 선택된 아이템들만 삭제
            for (const itemId of selectedItems) {
                await axios.delete(`http://localhost:8090/api/cart/${itemId}`, {
                    withCredentials: true
                });
            }
            
            // UI 업데이트
            setCartItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            setIsAllSelected(false);
            
            alert('선택한 상품이 삭제되었습니다.');
        } catch (error) {
            console.error('상품 삭제 실패:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 개별 상품 삭제 함수도 withCredentials 옵션 추가
    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8090/api/cart/${itemId}`, {
                withCredentials: true
            });
            
            setCartItems(prev => prev.filter(item => item.id !== itemId));
            setSelectedItems(prev => prev.filter(id => id !== itemId));
            
            if (cartItems.length <= 1) {
                setIsAllSelected(false);
            }
        } catch (error) {
            console.error('상품 삭제 실패:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div className='cart-container'>
                <div className='cart-content'>
                    <h2>장바구니</h2>
                    
                    <div className="cart-grid">
                        {/* 왼쪽 영역 */}
                        <div className="cart-left">
                            {/* 전체 선택 영역 */}
                            <div className="cart-select-box">
                                <div className="cart-select-all">
                                    <div className="select-area">
                                        <input 
                                            type="checkbox" 
                                            id="selectAll"
                                            checked={isAllSelected}
                                            onChange={SelectAll}
                                        />
                                        <label htmlFor="selectAll">
                                            전체선택 {selectedItems.length}/{cartItems.length}
                                        </label>
                                    </div>
                                    <div>
                                        <button 
                                            className="delete-selected-button"
                                            onClick={handleDeleteSelected}
                                        >
                                            선택삭제
                                        </button>
                                        <button 
                                            className="delete-all-button"
                                            onClick={handleDeleteAll}
                                        >
                                            전체삭제
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 상품 목록 영역 */}
                            <div className="cart-items-box">
                                {cartItems.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="cart-item-checkbox">
                                            <input 
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleItemSelect(item.id)}
                                            />
                                        </div>
                                        <div className="cart-item-info">
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="cart-item-details">
                                                <div className="cart-item-name">
                                                    <span className="delivery-type">{item.type}</span>
                                                    <h3>{item.name}</h3>
                                                    <p className="item-option">{item.option}</p>
                                                </div>
                                                <div className="cart-item-right">
                                                    <div className="amount-control">
                                                        <button 
                                                            className="amount-button"
                                                            onClick={() => handleAmountChange(item.id, -1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="amount">{item.amount}</span>
                                                        <button 
                                                            className="amount-button"
                                                            onClick={() => handleAmountChange(item.id, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="cart-item-price">
                                                        <span className="price">{(item.price * item.amount).toLocaleString()}원</span>
                                                    </div>
                                                    <button 
                                                        className="cart-delete-button"
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" 
                                                                fill="#999"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽 영역 */}
                        <div className="cart-right">
                            {/* 결제 정보 */}
                            <div className="payment-box">
                                <div className="payment-info">
                                    <div className="payment-row">
                                        <span>결제금액</span>
                                    </div>
                                    <div className="payment-row">
                                        <span>상품금액</span>
                                        <span>{totalPrice.toLocaleString()}원</span>
                                    </div>
                                    <div className="payment-row">
                                        <span>배송비</span>
                                        {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                                            <span>무료</span>
                                        ) : (
                                            <span>{SHIPPING_FEE.toLocaleString()}원</span>
                                        )}
                                        {totalPrice > 0 && totalPrice < FREE_SHIPPING_THRESHOLD && (
                                            <span className="sub-text">
                                                {(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString()}원 추가시 무료배송
                                            </span>
                                        )}
                                    </div>
                                    <div className="payment-row total">
                                        <span>결제예정금액</span>
                                        <span>{finalPrice.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 로그인 버튼 */}
                            <div className="login-box">
                                <button 
                                    className="order-button"
                                    onClick={handleButtonClick}
                                >
                                    {isLoggedIn ? '구매하기' : '로그인'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;