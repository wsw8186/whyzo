import React, { useState, useEffect } from 'react';
import '../css/Header.css';
import logo from '../img/1234.svg';
import '../css/common/CommonStyles.css';
import '../css/variables.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data.isAuthenticated) {
                    setIsLogin(true);
                    setUserName(response.data.name);
                    setIsAdmin(response.data.roles.includes('ROLE_ADMIN'));
                } else {
                    setIsLogin(false);
                    setUserName('');
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('인증 확인 실패:', error);
                setIsLogin(false);
                setUserName('');
                setIsAdmin(false);
            }
        };

        checkLoginStatus();

        const interval = setInterval(checkLoginStatus, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8090/api/auth/logout', null, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setIsLogin(false);
                setUserName('');
                setIsAdmin(false);
                window.location.href = '/';
            } else {
                alert('로그아웃 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
        }
    };

    return (
        <>
            <div className="coupon">
                지금 가입하고, 1만원 할인 쿠폰 받아가세요!
            </div>
            <div className="header">
                <div className="left">
                    <a href="/"><img src={logo} alt="로고" /></a><a href="/"><span>마켓컬리</span></a>
                </div>
                
                <div className="search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button type="submit">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.81 18.74L25.5 24.43" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M13.5 21C17.6421 21 21 17.6421 21 13.5C21 9.35786 17.6421 6 13.5 6C9.35786 6 6 9.35786 6 13.5C6 17.6421 9.35786 21 13.5 21Z" stroke="#333333" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </form>
                </div>
                
                <div className="right">
                    {isLogin ? (
                        <>
                            <span className="welcome-message">{userName}님</span>
                            {isAdmin ? (
                                <>
                                    <a href="/admin/products" className="admin-link">관리자</a>
                                    <button onClick={handleLogout} className="logout-button">로그아웃</button>
                                </>
                            ) : (
                                <>
                                    <a href="/user/mypage">마이페이지</a>
                                    <a href="/cart">
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.8329 8.33333H25.8329L23.3329 17.5H13.3329M23.3329 20.8333H13.3329L10.8329 5H8.33291" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21.6663 25C22.5827 25 23.3329 24.2497 23.3329 23.3333C23.3329 22.4169 22.5827 21.6667 21.6663 21.6667C20.7499 21.6667 19.9996 22.4169 19.9996 23.3333C19.9996 24.2497 20.7499 25 21.6663 25Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14.9996 25C15.916 25 16.6663 24.2497 16.6663 23.3333C16.6663 22.4169 15.916 21.6667 14.9996 21.6667C14.0832 21.6667 13.3329 22.4169 13.3329 23.3333C13.3329 24.2497 14.0832 25 14.9996 25Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        장바구니
                                    </a>
                                    <button onClick={handleLogout} className="logout-button">로그아웃</button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <a href="/user/register">회원가입</a>
                            <a href="/user/login">로그인</a>
                            <a href="/cart">
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.8329 8.33333H25.8329L23.3329 17.5H13.3329M23.3329 20.8333H13.3329L10.8329 5H8.33291" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21.6663 25C22.5827 25 23.3329 24.2497 23.3329 23.3333C23.3329 22.4169 22.5827 21.6667 21.6663 21.6667C20.7499 21.6667 19.9996 22.4169 19.9996 23.3333C19.9996 24.2497 20.7499 25 21.6663 25Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14.9996 25C15.916 25 16.6663 24.2497 16.6663 23.3333C16.6663 22.4169 15.916 21.6667 14.9996 21.6667C14.0832 21.6667 13.3329 22.4169 13.3329 23.3333C13.3329 24.2497 14.0832 25 14.9996 25Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                장바구니
                            </a>
                        </>
                    )}
                </div>
            </div>

            <div className="dropdown">
                <div className="dropdown-wrapper">
                    <div className="dropdown-label">
                        <svg width="16" height="14" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h16v1.7H0V0zm0 6.15h16v1.7H0v-1.7zm0 6.15h16V14H0v-1.7z" fill="currentColor" fillRule="evenodd"/>
                        </svg>
                        <span>카테고리</span>
                        <div className="dropdown-menu">
                            <div className="dropdown-item"><a href="/product/list">2024 연말정산</a></div>
                            <div className="dropdown-item"><a href="/product/list">채소</a></div>
                            <div className="dropdown-item"><a href="/product/list">과일 견과 쌀</a></div>
                            <div className="dropdown-item"><a href="/product/list">수산 해산 건어물</a></div>
                            <div className="dropdown-item"><a href="/product/list">정육 가공육 계란</a></div>
                            <div className="dropdown-item"><a href="/product/list">국 반찬 메인요리</a></div>
                        </div>
                    </div>
                    <div className="list-item"><a href='/product/list'>신상품</a></div>
                    <div className="list-item"><a href='/product/list'>베스트</a></div>
                    <div className="list-item"><a href='/product/list'>알뜰쇼핑</a></div>
                    <div className="list-item"><a href='/product/list'>특가/혜택</a></div>
                </div>
            </div>
        </>
    );
}

export default Header; 