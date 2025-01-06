import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "../../css/seller/ProductAdd.css";
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";

function ProductAdd() {
    // 사용자 로그인 여부 확인, 사용자명, 아이디, 권한 가져오기
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const hasValidRole = response.data.roles.includes('ROLE_ADMIN') || 
                                   response.data.roles.includes('ROLE_MEMBER');
                
                if (!hasValidRole) {
                    navigate("/"); // 권한 없으면 메인으로 즉시 리다이렉트
                    return;
                }

                // 권한이 있는 경우에만 상태 업데이트
                setIsLogin(true);
                setUserName(response.data.name);
                setUserId(response.data.userId);
                setUserRole(response.data.roles);
                
            } catch (error) {
                console.error('인증 확인 실패:', error);
                navigate("/"); // 에러 발생시 메인으로 리다이렉트
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
        const interval = setInterval(checkLoginStatus, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [navigate]);

    // 상품 등록
    const [productData, setProductData] = useState({
        productname: "",
        price: "",
        discount: "",
        type: "냉장",
        subtitle: "",
        unit: "",
        description: "",
        image: null,
        imagePreview: null,
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // 기존 URL 객체들 해제
        previewImages.forEach(url => URL.revokeObjectURL(url));

        // 이미지 미리보기 생성
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];

        // 제거되는 이미지의 URL 객체 해제
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setPreviewImages(newPreviews);

        // 모든 이미지가 삭제된 경우에만 input 초기화
        if (newImages.length === 0) {
            fileInputRef.current.value = '';
        }

        // DataTransfer 객체를 사용하여 새로운 FileList 생성
        const dataTransfer = new DataTransfer();
        newImages.forEach(file => {
            dataTransfer.items.add(file);
        });

        // input의 files 속성 업데이트
        fileInputRef.current.files = dataTransfer.files;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수 입력값 검증
        if (!productData.productname.trim()) {
            alert('상품명을 입력해주세요.');
            return;
        }
        if (!productData.price) {
            alert('가격을 입력해주세요.');
            return;
        }
        if (!productData.discount) {
            alert('할인율을 입력해주세요.');
            return;
        }
        if (!productData.type) {
            alert('상품 타입을 선택해주세요.');
            return;
        }
        if (!productData.unit.trim()) {
            alert('상품 무게를 입력해주세요.');
            return;
        }
        if (!productData.subtitle.trim()) {
            alert('상품 부제목을 입력해주세요.');
            return;
        }
        if (!productData.description.trim()) {
            alert("상품 설명을 입력해주세요.");
            return;
        }
        if (images.length === 0) {
            alert('상품 이미지를 등록해주세요.');
            return;
        }
        // 가격과 할인율 유효성 검사
        if (isNaN(productData.price) || productData.price <= 0) {
            alert('유효한 가격을 입력해주세요.');
            return;
        }
        if (productData.discount) {
            if (isNaN(productData.discount) || productData.discount < 0 || productData.discount > 100) {
                alert('할인율은 0에서 100 사이의 숫자여야 합니다.');
                return;
            }
        }

        const formData = new FormData();
        const pData = {
            productname: productData.productname,
            seller: userId,
            price: productData.price,
            discount: productData.discount || 0,
            type: productData.type,
            unit: productData.unit,
            subtitle: productData.subtitle,
            description: productData.description,
            userId,
        };
        formData.append(
            "data",
            new Blob([JSON.stringify(pData)], { type: "application/json" })
        );

        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await axios.post("http://localhost:8090/product/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("상품이 성공적으로 등록되었습니다.");
                setProductData({
                    productname: "",
                    price: "",
                    discount: "",
                    type: "냉장",
                    subtitle: "",
                    unit: "",
                    description: "",
                    image: null,
                    imagePreview: null,
                });
                setImages([]);
                setPreviewImages([]);
                //ref속성 이용하면 초기화가능
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                alert("상품 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("상품 등록 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        return () => {
            previewImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 폼 초기화 함수 추가
    const resetForm = () => {
        setProductData({
            productname: "",
            price: "",
            discount: "",
            type: "냉장",
            subtitle: "",
            unit: "",
            description: "",
            image: null,
            imagePreview: null,
        });
        setImages([]);
        setPreviewImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="product-register-container">
            <h2>상품 등록</h2>
            <form onSubmit={handleSubmit} className="product-register-form">
                <div className="form-group">
                    <label>상품명</label>
                    <input
                        type="text"
                        name="productname"
                        value={productData.productname}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>가격</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>할인율 (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={productData.discount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>상품 타입</label>
                    <select
                        name="type"
                        value={productData.type}
                        onChange={handleInputChange}
                    >
                        <option value="냉장">냉장</option>
                        <option value="냉동">냉동</option>
                        <option value="상온">상온</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>상품 무게</label>
                    <input
                        type="text"
                        name="unit"
                        value={productData.unit}
                        onChange={handleInputChange}
                        placeholder="예: 5kg, 10g"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>상품 부제목</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={productData.subtitle}
                        onChange={handleInputChange}
                        placeholder="예: NEW! 12월 신상품! 7종 (택1)"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>상품 설명</label>
                    <textarea
                        type="text"
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        placeholder="근사한 비주얼부터 쏙 발라먹는 재미까지, 폭립을 즐겨 찾는 분들이 많으실 텐데요."
                        autoComplete="off"
                    />
                </div>

                <div className="image-upload-section">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />

                    <div className="image-preview-container">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="remove-image-btn"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="handleSubmit" className="submit-button">
                    상품 등록
                </button>
                <button type="button" className="submit-button" onClick={() => {
                    resetForm();
                    navigate('/');
                }}>취소</button>
            </form>
        </div>
    );
}

export default ProductAdd;