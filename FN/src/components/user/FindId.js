import React, { useState } from 'react';
import axios from 'axios'; 
import '../../css/user/Find.css'; 

function FindId() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFindId = async (e) => {
        e.preventDefault();
        
        if (!name || !email) {
            alert('이름과 이메일을 모두 입력해주세요.');
            return;
        }
        
        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8090/api/v1/users', {
                params: { name, email }
            });

            if (response.data === true) {
                setMessage('입력하신 이메일로 아이디를 전송했습니다.');
            } else {
                setMessage('입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.');
            }
        } catch (error) {
            setMessage('입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.');
            console.error('Find ID error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="find-container">
            <h2>아이디 찾기</h2>
            <form onSubmit={handleFindId}>
                <h3>이름</h3>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="이름을 입력해주세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                <button type="submit" disabled={loading}>아이디 찾기</button>
            </form>
            <div className="find-result">
                {loading && <div className="loader"></div>}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default FindId; 