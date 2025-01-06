import React, { useState, useEffect } from 'react';
import "../../css/user/Register.css";
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";

import axios from 'axios';

function Register() {
    useEffect(() => {
        // IMP.init 초기화 (Import는 클라이언트 스크립트 로드 시 필요)
        const { IMP } = window;
        if (IMP) {
          IMP.init(); // 가맹점 식별코드
        }
      }, []);

    const [formData, setFormData] = useState({
        id: '',
        password: '',
        passwordConfirm: '',
        name: '',
        emailId: '',
        emailDomain: '',
        phone: '',
        address: '',
        addressDetail: '',
        zonecode: ''
    });

    const [errors, setErrors] = useState({
        id: '',
        password: '',
        passwordConfirm: '',
        name: '',
        email: '',
        phone: ''
    });

    const [isCustomDomain, setIsCustomDomain] = useState(false);

    const [terms, setTerms] = useState({
        all: false,
        required1: false,  // 이용약관
        required2: false,  // 개인정보
        required3: false,  // 14세 이상
        optional1: false,  // 혜택/정보 수신
        sms: false,
        email: false
    });

    const [isIdChecked, setIsIdChecked] = useState(false);  // 아이디 중복확인 여부

    const [isIdentityVerified, setIsIdentityVerified] = useState(false); // 본인 인증 상태

    const validateId = (value) => {
        if (value.length < 6) {
            return '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        }
        if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
            return '올바른 아이디를 입력해주세요.';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (value.length < 10) {
            return '최소 10자 이상 입력';
        }

        // 영문/숫자/특수문자 각각의 포함 여부 체크
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        // 공백 포함 체크
        if (/\s/.test(value)) {
            return '공백은 사용할 수 없습니다.';
        }

        // 허용되지 않는 특수문자 체크 (허용된 특수문자 외의 문자 체크)
        if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
            return '영문/숫자/특수문자만 허용됩니다.';
        }

        // 2개 이상 조합 체크
        const combinationCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
        if (combinationCount < 2) {
            return '영문/숫자/특수문자(공백 제외) 중 2가지 이상을 조합해주세요.';
        }

        return '';
    };

    const validatePasswordConfirm = (value) => {
        if (value !== formData.password) {
            return '동일한 비밀번호를 입력';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 아이디가 변경되면 중복확인 상태 초기화
        if (name === 'id') {
            setIsIdChecked(false);
        }

        // 실시간 유효성 검사
        let error = '';
        switch (name) {
            case 'id':
                error = validateId(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'passwordConfirm':
                error = validatePasswordConfirm(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleDomainChange = (e) => {
        const value = e.target.value;
        if (value === 'direct') {
            setIsCustomDomain(true);
            setFormData(prev => ({
                ...prev,
                emailDomain: ''
            }));
        } else {
            setIsCustomDomain(false);
            setFormData(prev => ({
                ...prev,
                emailDomain: value
            }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const onlyNumbers = value.replace(/[^0-9]/g, '');
        
        if (value !== onlyNumbers) {
            setErrors(prev => ({
                ...prev,
                phone: '휴대폰 번호를 입력해주세요'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                phone: ''
            }));
        }
        
        setFormData(prev => ({
            ...prev,
            phone: onlyNumbers
        }));
    };

    const handleAllCheck = (e) => {
        const { checked } = e.target;
        setTerms({
            all: checked,
            required1: checked,
            required2: checked,
            required3: checked,
            optional1: checked,
            sms: checked,
            email: checked
        });
    };

    const handleTermCheck = (e) => {
        const { name, checked } = e.target;
        
        // SMS/이메일 체크박스 처리
        if (name === 'optional1') {
            setTerms(prev => ({
                ...prev,
                [name]: checked,
                sms: checked,
                email: checked
            }));
        } else if (name === 'sms' || name === 'email') {
            const otherOption = name === 'sms' ? 'email' : 'sms';
            setTerms(prev => ({
                ...prev,
                [name]: checked,
                optional1: checked && prev[otherOption]
            }));
        } else {
            setTerms(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    useEffect(() => {
        const allChecked = 
            terms.required1 && 
            terms.required2 && 
            terms.required3 && 
            terms.optional1 && 
            terms.sms && 
            terms.email;
        
        if (terms.all !== allChecked) {
            setTerms(prev => ({
                ...prev,
                all: allChecked
            }));
        }
    }, [terms.required1, terms.required2, terms.required3, terms.optional1, terms.sms, terms.email]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // 아이디 중복확인 여부 체크
        if (!isIdChecked) {
            alert('아이디 중복확인을 해주세요.');
            return;
        }
    
        // 필수 입력값 검증
        if (!formData.id) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (errors.id) {
            alert('아이디를 올바르게 입력해주세요.');
            return;
        }
    
        if (!formData.password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (errors.password) {
            alert('비밀번호를 올바르게 입력해주세요.');
            return;
        }
    
        if (!formData.passwordConfirm) {
            alert('비밀번호 확인을 입력해주세요.');
            return;
        }
        if (errors.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
    
        if (!formData.name) {
            alert('이름을 입력해주세요.');
            return;
        }
    
        if (!formData.emailId || !formData.emailDomain) {
            alert('이메일을 입력해주세요.');
            return;
        }
    
        if (!formData.phone) {
            alert('휴대폰 번호를 입력해주세요.');
            return;
        }
        if (errors.phone) {
            alert('휴대폰 번호를 올바르게 입력해주세요.');
            return;
        }
    
        // 주소 필드 검증
        if (!formData.zonecode || !formData.address) {
            alert('주소를 입력해주세요.');
            return;
        }
    
        // 필수 약관 체크 확인
        if (!terms.required1 || !terms.required2 || !terms.required3) {
            alert('필수 약관에 모두 동의해주세요.');
            return;
        }
    
        // 본인 인증 여부 체크
        if (!isIdentityVerified) {
            alert('본인 인증을 완료해주세요.');
            return;
        }
    
        try {
            // 생일 데이터 포맷팅 (YYYY/MM/DD)
            const birthYear = document.querySelector('input[placeholder="YYYY"]').value;
            const birthMonth = document.querySelector('input[placeholder="MM"]').value.padStart(2, '0');
            const birthDay = document.querySelector('input[placeholder="DD"]').value.padStart(2, '0');
            const birthDate = birthYear && birthMonth && birthDay
                ? `${birthYear}/${birthMonth}/${birthDay}`
                : null;
    
            const genderInput = document.querySelector('input[name="gender"]:checked');
            const gender = genderInput ? genderInput.value : null;
    
            const userData = {
                userId: formData.id,
                password: formData.password,
                name: formData.name,
                email: `${formData.emailId}@${formData.emailDomain}`,
                phone: formData.phone,
                address: {
                    zipCode: formData.zonecode,
                    address: formData.address,
                    addressDetail: formData.addressDetail,
                },
                marketingConsent: {
                    smsConsent: terms.sms,
                    emailConsent: terms.email,
                },
                gender: gender,
                birthDate: birthDate,
            };
    
            const response = await axios.post('http://localhost:8090/api/v1/users', userData);
    
            if (response.status === 201) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/user/login';
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    alert(error.response.data.message);
                } else {
                    alert('회원가입 중 오류가 발생했습니다. ' + error.response.data.message);
                }
            } else if (error.request) {
                alert('서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.');
            } else {
                alert('회원가입 처리 중 오류가 발생했습니다.');
            }
            console.error('Registration error:', error);
        }
    };
    

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
                setFormData(prev => ({
                    ...prev,
                    address: data.address,
                    zonecode: data.zonecode
                }));
            }
        }).open();
    };

    const handleCheckDuplicate = async () => {
        if (!formData.id) {
            alert('아이디를 입력해주세요.');
            return;
        }
        
        // 아이디 유효성 검사
        const idError = validateId(formData.id);
        if (idError) {
            alert(idError);
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:8090/api/v1/users/${formData.id}`);
            if (response.status === 200) {
                alert('이미 사용중인 아이디입니다.');
                setIsIdChecked(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('사용 가능한 아이디입니다.');
                setIsIdChecked(true);
            } else {
                alert('중복 확인 중 오류가 발생했습니다.');
                setIsIdChecked(false);
            }
        }
    };

    const handleCertification = () => {
        const { IMP } = window;
        if (!IMP) {
            alert("IMP 객체 초기화에 문제가 발생했습니다.");
            return;
        }

        IMP.init();

        IMP.certification(
            {
                channelKey: ,
                merchant_uid: `mid_${new Date().getTime()}`,
                popup: true,
            },
            function (rsp) {

                if (rsp.success && rsp.imp_uid) {

                    axios
                        .post("http://localhost:8090/certifications", {
                            imp_uid: rsp.imp_uid
                        })
                        .then((response) => {
                            const certData = response.data.response;
                            
                            // 입력된 정보와 인증 정보 비교
                            let errorMessages = [];
                            
                            // 이름 비교
                            if (formData.name && formData.name !== certData.name) {
                                errorMessages.push("이름이 본인인증 정보와 일치하지 않습니다.");
                            }
                            
                            // 전화번호 비교 (하이픈 제거 후 비교)
                            const certPhone = certData.phone.replace(/-/g, '');
                            if (formData.phone && formData.phone !== certPhone) {
                                errorMessages.push("휴대폰 번호가 본인인증 정보와 일치하지 않습니다.");
                            }
                            
                            // 생년월일 비교
                            const birthYear = document.querySelector('input[placeholder="YYYY"]').value;
                            const birthMonth = document.querySelector('input[placeholder="MM"]').value.padStart(2, '0');
                            const birthDay = document.querySelector('input[placeholder="DD"]').value.padStart(2, '0');
                            
                            if (birthYear && birthMonth && birthDay) {
                                const inputBirth = `${birthYear}-${birthMonth}-${birthDay}`;
                                if (inputBirth !== certData.birthday) {
                                    errorMessages.push("생년월일이 본인인증 정보와 일치하지 않습니다.");
                                }
                            }
                            
                            // 성별 비교
                            const selectedGender = document.querySelector('input[name="gender"]:checked')?.value;
                            if (selectedGender && selectedGender !== 'none') {
                                if (selectedGender !== certData.gender) {
                                    errorMessages.push("성별이 본인인증 정보와 일치하지 않습니다.");
                                }
                            }
                            
                            if (errorMessages.length > 0) {
                                // 불일치하는 정보가 있는 경우
                                alert(errorMessages.join('\n') + '\n\n입력하신 정보를 다시 확인해주세요.');
                                setIsIdentityVerified(false);
                            } else {
                                // 모든 정보가 일치하는 경우
                                setIsIdentityVerified(true);
                                alert("본인인증이 완료되었습니다.");
                                
                                // 인증 정보로 데이터 자동 업데이트
                                setFormData(prev => ({
                                    ...prev,
                                    name: certData.name,
                                    phone: certPhone
                                }));

                                // 이름과 전화번호 비활성화
                                document.querySelector('input[name="name"]').value = certData.name;
                                document.querySelector('input[name="name"]').disabled = true;

                                document.querySelector('input[name="phone"]').value = certPhone;
                                document.querySelector('input[name="phone"]').disabled = true;
                                
                                // 생년월일 입력
                                const birthParts = certData.birthday.split('-');
                                document.querySelector('input[placeholder="YYYY"]').value = birthParts[0];
                                document.querySelector('input[placeholder="MM"]').value = birthParts[1];
                                document.querySelector('input[placeholder="DD"]').value = birthParts[2];

                                // 입력 필드 비활성화
                                document.querySelector('input[placeholder="YYYY"]').disabled = true;
                                document.querySelector('input[placeholder="MM"]').disabled = true;
                                document.querySelector('input[placeholder="DD"]').disabled = true;
                                
                                // 성별 선택
                                const genderInput = document.querySelector(`input[name="gender"][value="${certData.gender}"]`);
                                if (genderInput) {
                                    genderInput.checked = true;
                                }

                                const allGenderInputs = document.querySelectorAll('input[name="gender"]');
                                allGenderInputs.forEach((input) => {
                                    input.disabled = true;
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("서버 인증 실패:", error);
                            setIsIdentityVerified(false);
                            alert("서버 인증 처리 중 오류가 발생했습니다.");
                        });
                } else {
                    console.error("본인인증 실패:", rsp);
                    setIsIdentityVerified(false);
                    alert(`본인인증에 실패했습니다. 오류 메시지: ${rsp.error_msg}`);
                }
            }
        );
    };



    return (
        <div className='register'>
            <h2>회원가입</h2>
            <div className="register-required">
                <span className="required-text">* 필수입력사항</span> 
            </div>
            <div className='register-form'>
                <form onSubmit={handleSubmit}>
                    <div className='register-form-item'>
                        <label>아이디<span className="required">*</span></label>
                        <div className="input-wrapper">
                            <div className="input-btn-wrapper">
                                <input 
                                    type='text' 
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    placeholder='아이디를 입력해주세요'
                                    autoComplete="off"
                                />
                                <button type="button" className="check-button" onClick={handleCheckDuplicate}>중복확인</button>
                            </div>
                            <div className="error-wrapper">
                                {errors.id && <p className="error-message">{errors.id}</p>}
                            </div>
                        </div>
                    </div>

                    <div className='register-form-item'>
                        <label>비밀번호<span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input 
                                type='password' 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='비밀번호를 입력해주세요'
                            />
                            <div className="error-wrapper">
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    <div className='register-form-item'>
                        <label>비밀번호확인<span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input 
                                type='password'
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleInputChange}
                                placeholder='비밀번호를 한번 더 입력해주세요'
                            />
                            <div className="error-wrapper">
                                {errors.passwordConfirm && <p className="error-message">{errors.passwordConfirm}</p>}
                            </div>
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>이름<span className="required">*</span></label>
                        <div className="input-wrapper">
                            <input 
                                type='text' 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder='이름을 입력해주세요'
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>이메일<span className="required">*</span></label>
                        <div className="input-wrapper email-wrapper">
                            <input 
                                type='text' 
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                placeholder='예: marketkurly' 
                                className="email-input"
                                autoComplete="off"
                            />
                            <span className="email-at">@</span>
                            {isCustomDomain ? (
                                <input 
                                    type='text' 
                                    placeholder='직접 입력' 
                                    autoComplete="off"
                                    className="email-domain"
                                    value={formData.emailDomain}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        emailDomain: e.target.value
                                    }))}
                                />
                            ) : (
                                <input 
                                    type='text' 
                                    placeholder='선택 하기'
                                    className="email-domain"
                                    value={formData.emailDomain}
                                    readOnly
                                />
                            )}
                            <select 
                                className="email-select"
                                onChange={handleDomainChange}
                                value={isCustomDomain ? 'direct' : formData.emailDomain}
                            >
                                <option value="">선택</option>
                                <option value="direct">직접입력</option>
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="hanmail.net">hanmail.net</option>
                                <option value="nate.com">nate.com</option>
                                <option value="kakao.com">kakao.com</option>
                            </select>
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>휴대폰<span className="required">*</span></label>
                        <div className="input-wrapper with-button">
                            <div>
                                <input 
                                    type='tel'
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    placeholder='숫자만 입력해주세요'
                                    maxLength="11"
                                    autoComplete="off"
                                />
                                <button type="button" className="auth-button" onClick={handleCertification}>본인 인증 하기</button>
                            </div>
                            <div className="error-wrapper">
                                {errors.phone && <p className="error-message">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>주소<span className="required">*</span></label>
                        <div className="input-wrapper address">
                            {!formData.address ? (
                                // 주소 입력 전
                                <button 
                                    type="button" 
                                    className="address-search-button"
                                    onClick={handleAddressSearch}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20">
                                        <g fill="none" fillRule="evenodd">
                                            <path fill="#FFF" fillOpacity="0" fillRule="nonzero" d="M0 0H20V20H0z" transform="translate(.4)"/>
                                            <path fill="#5F0080" d="M9.333 4.667C11.911 4.667 14 6.756 14 9.333c0 1.051-.347 2.02-.933 2.8.024.018.048.04.071.062l2 2c.26.26.26.683 0 .943-.26.26-.682.26-.943 0l-2-2-.061-.071c-.78.586-1.75.933-2.8.933-2.578 0-4.667-2.09-4.667-4.667s2.089-4.666 4.666-4.666zm0 1.333C7.493 6 6 7.492 6 9.333c0 1.841 1.492 3.334 3.333 3.334 1.841 0 3.334-1.493 3.334-3.334C12.667 7.493 11.174 6 9.333 6z" transform="translate(.4)"/>
                                        </g>
                                    </svg>
                                    주소 검색
                                </button>
                            ) : (
                                // 주소 입력 후
                                <>
                                    <input 
                                        type="text" 
                                        value={`${formData.zonecode} ${formData.address}`} 
                                        readOnly
                                        className="address-input"
                                    />
                                    <input
                                        type="text"
                                        name="addressDetail"
                                        value={formData.addressDetail}
                                        onChange={handleInputChange}
                                        placeholder="상세주소를 입력해주세요"
                                        className="address-detail-input"
                                        autoComplete="off"
                                    />
                                    <button 
                                        type="button" 
                                        className="address-change-button"
                                        onClick={handleAddressSearch}
                                    >
                                        재검색
                                    </button>
                                </>
                            )}
                            <p className="address-guide">
                                배송지에 따라 상품 정보가 달라질 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>성별</label>
                        <div className="input-wrapper radio-group">
                            <label className="radio-label">
                                <input type="radio" name="gender" value="male"/>
                                <span>남자</span>
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="gender" value="female"/>
                                <span>여자</span>
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="gender" value="none" defaultChecked/>
                                <span>선택안함</span>
                            </label>
                        </div>
                    </div>
                    <div className='register-form-item'>
                        <label>생년월일</label>
                        <div className="input-wrapper birth-input">
                            <input type="text" placeholder="YYYY" maxLength="4"/>
                            <span className="birth-separator">/</span>
                            <input type="text" placeholder="MM" maxLength="2"/>
                            <span className="birth-separator">/</span>
                            <input type="text" placeholder="DD" maxLength="2"/>
                        </div>
                    </div>
                    <div className='register-form-item terms-section'>
                        <label>이용약관동의<span className="required">*</span></label>
                        <div className="input-wrapper terms-wrapper">
                            <div className="terms-all">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="all"
                                        checked={terms.all}
                                        onChange={handleAllCheck}
                                    />
                                    <span>전체 동의합니다.</span>
                                </label>
                                <p className="terms-description">선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</p>
                            </div>
                            <div className="terms-list">
                                <div className="terms-item">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="required1"
                                            checked={terms.required1}
                                            onChange={handleTermCheck}
                                        />
                                        <span>이용약관 동의<span className="required-text">(필수)</span></span>
                                    </label>
                                    <button type="button" className="terms-view">약관보기 &gt;</button>
                                </div>
                                <div className="terms-item">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="required2"
                                            checked={terms.required2}
                                            onChange={handleTermCheck}
                                        />
                                        <span>개인정보 수집·이용 동의<span className="required-text">(필수)</span></span>
                                    </label>
                                    <button type="button" className="terms-view">약관보기 &gt;</button>
                                </div>
                                <div className="terms-item">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="optional1"
                                            checked={terms.optional1}
                                            onChange={handleTermCheck}
                                        />
                                        <span>무료배송, 할인쿠폰 등 혜택/정보 수신 동의<span className="choice-text">(선택)</span></span>
                                    </label>
                                    <button type="button" className="terms-view">약관보기 &gt;</button>
                                </div>
                                <div className="terms-sub-group">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="sms"
                                            checked={terms.sms}
                                            onChange={handleTermCheck}
                                        />
                                        <span>SMS</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="email"
                                            checked={terms.email}
                                            onChange={handleTermCheck}
                                        />
                                        <span>이메일</span>
                                    </label>
                                </div>
                                <div className="terms-item">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name="required3"
                                            checked={terms.required3}
                                            onChange={handleTermCheck}
                                        />
                                        <span>본인은 만 14세 이상입니다.<span className="required-text">(필수)</span></span>
                                    </label>
                                    <button type="button" className="terms-view">약관보기 &gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="register-button-wrapper">
                        <button 
                            type="submit" 
                            className="register-button"
                            disabled={!isIdChecked || !isIdentityVerified}  // 중복확인과 본인인증이 모두 완료되어야 활성화
                        >
                            가입하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
