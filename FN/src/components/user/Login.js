import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios 임포트
import '../../css/common/CommonStyles.css';
import '../../css/variables.css';
import '../../css/user/Login.css';
import google from '../../img/logo/google.png'
import naver from '../../img/logo/naver.png'
import kakao from '../../img/logo/kakao.webp'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

     // 로그인 상태 체크
     useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true
                });
                if (response.data.isAuthenticated) {
                    console.log('이미 로그인된 상태');
                    navigate('/'); // 로그인된 상태라면 메인 페이지로 이동
                }
            } catch (error) {
                console.error('로그인 상태 확인 중 오류:', error);
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8090/api/auth/login', 
                {
                    username: username.trim(),
                    password: password,
                    rememberMe: document.getElementById('rememberMe').checked
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                window.location.replace('/');
            } else {
                alert('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    alert(error.response.data || '아이디 또는 비밀번호가 올바르지 않습니다.');
                } else if (error.response.status === 400) {
                    alert(error.response.data || '입력 정보를 확인해주세요.');
                } else {
                    alert(error.response.data || '로그인 중 오류가 발생했습니다.');
                }
            } else if (error.request) {
                alert('서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.');
            } else {
                alert('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSocialLogin = (provider) => {
    
        const popup = window.open(
            `http://localhost:8090/oauth2/authorization/${provider}`,
            'OAuth2 Login',
            'width=500,height=600'
        );
    
        const handleMessage = (event) => {
    
            if (event.data.type === 'LOGIN_SUCCESS') {
                window.removeEventListener('message', handleMessage);
    
                if (window.opener) {
                    window.opener.location.href = '/';
                    window.close();
                } else {
                    window.location.replace('/');
                }
            }
        };
    
        window.addEventListener('message', handleMessage);
    };
    

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="아이디를 입력해주세요" 
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="비밀번호를 입력해주세요" 
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="login-options">
                    <div className="checkbox-wrapper">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">로그인 상태 유지</label>
                    </div>
                    <div className="find-links">
                        <Link to="/user/find/id">아이디 찾기</Link>
                        <span className="divider">|</span>
                        <Link to="/user/find/pw">비밀번호 찾기</Link>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="login-button">로그인</button>
                    <Link to="/user/register" className="register-link">회원가입</Link>
                </div>
            </form>

            <div className="social-login">
                <p className="social-title">소셜 간편 로그인</p>
                <div className="social-buttons">
                    <button 
                        className="social-button kakao"
                        onClick={() => handleSocialLogin('kakao')}
                    >
                        <img src={kakao} alt="카카오 로그인" />
                        <span>카카오</span>
                    </button>
                    <button 
                        className="social-button naver"
                        onClick={() => handleSocialLogin('naver')}
                    >
                        <img src={naver} alt="네이버 로그인" />
                        <span>네이버</span>
                    </button>
                    <button 
                        className="social-button google"
                        onClick={() => handleSocialLogin('google')}
                    >
                        <img src={google} alt="구글 로그인" />
                        <span>Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
