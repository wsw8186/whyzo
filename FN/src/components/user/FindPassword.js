import React, { useState } from 'react';
import axios from 'axios'; 
import '../../css/user/Find.css'; 

function FindPassword() {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFindPassword = async (e) => {
        e.preventDefault();

        if (!userId || !email) {
            alert('아이디와 이메일을 모두 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8090/api/v1/users/password-resets', null, {
                params: { userId, email }
            });

            if (response.status === 200) {
                setMessage('입력하신 이메일로 비밀번호 재설정 링크를 전송했습니다.');
            }
        } catch (error) {
            console.error('Find Password error:', error);
            setMessage('입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="find-container">
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleFindPassword}>
                <h3>아이디</h3>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="아이디를 입력해주세요"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <h3>이메일</h3>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder="이메일을 입력해주세요" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>비밀번호 찾기</button>
            </form>
            <div className="find-result">
                {loading && <div className="loader"></div>}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default FindPassword; 