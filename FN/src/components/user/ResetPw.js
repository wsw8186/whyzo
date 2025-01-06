import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";
import "../../css/user/ResetPw.css";

function ResetPw() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [validToken, setValidToken] = useState(true);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({ password: "", confirmPassword: "" });
    const [passwordError, setPasswordError] = useState(""); // Added state for password error
    const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Added state for confirm password error

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/v1/users/password-resets/${token}`);
                if (response.status === 200) {
                    setValidToken(true);
                }
            } catch (error) {
                setMessage("링크가 유효하지 않거나 시간이 지났습니다.");
            }
        };

        if (token) {
            validateToken();
        } else {
            setMessage("토큰이 없습니다.");
        }
    }, [token]);

    // 비밀번호 유효성 검사 함수
    const validatePassword = (value) => {
        if (value.length < 10) {
            return '최소 10자 이상 입력';
        }

        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (/\s/.test(value)) {
            return '공백은 사용할 수 없습니다.';
        }

        if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
            return '영문/숫자/특수문자만 허용됩니다.';
        }

        const combinationCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
        if (combinationCount < 2) {
            return '영문/숫자/특수문자(공백 제외) 중 2가지 이상을 조합해주세요.';
        }

        return '';
    };

    // 확인 비밀번호 유효성 검사 함수
    const validatePasswordConfirm = (value) => {
        if (value !== formValues.password) {
            return '동일한 비밀번호를 입력';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        // 비밀번호 입력시 유효성 검사
        if (name === "password") {
            setPasswordError(validatePassword(value));
        }

        // 비밀번호 확인 입력시 유효성 검사
        if (name === "confirmPassword") {
            setConfirmPasswordError(validatePasswordConfirm(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(formValues.password);
        const confirmPasswordError = validatePasswordConfirm(formValues.confirmPassword);

        if (passwordError || confirmPasswordError) {
            setPasswordError(passwordError);
            setConfirmPasswordError(confirmPasswordError);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(`http://localhost:8090/api/v1/users/password-resets/${token}`, {
                password: formValues.password
            });

            if (response.status === 200) {
                setMessage("비밀번호가 성공적으로 변경되었습니다.");
                setTimeout(() => {
                    window.location.href="/"
                }, 3000);
            }
        } catch (error) {
            setMessage(error.response?.data || "서버에 문제가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return <div>{message}</div>;
    }

    return (
        <div className="container">
            <div className="reset-container">
                <h2>비밀번호 재설정</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>새 비밀번호:</label>
                        <input
                            type="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            className="input-base"
                            required
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    <div className="input-group">
                        <label>비밀번호 확인:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            className="input-base"
                            required
                        />
                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                    </div>
                    <button type="submit" className="button button-primary" disabled={loading}>
                        {loading ? "로딩 중..." : "비밀번호 재설정"}
                    </button>
                </form>
                <div className="reset-result">
                    {loading && <div className="loader"></div>}
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default ResetPw;
