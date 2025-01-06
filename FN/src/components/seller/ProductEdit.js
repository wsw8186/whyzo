import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/seller/ProductAdd.css";
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";

function ProductEdit() {
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState(null);
    const { productid } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        productid: '',
        seller: '',
        productname: '',
        price: '',
        discount: '',
        type: '냉장',
        unit: '',
        description: '',
        subtitle: '',
        image: null,
        imagePreview: null,
    });

    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);


    const getProduct = async (id, userId, roles) => {
        try {
            const prodResp = await axios.get(`http://localhost:8090/product/edit/${id}`);
            console.log("서버 응답 데이터:", prodResp.data);

            // ADMIN이 아니면서 자신의 상품이 아닌 경우 접근 제한
            if (!roles.includes('ROLE_ADMIN') && userId !== prodResp.data.seller) {
                navigate("/");
                return;
            }

            // 이미지 배열이 있는지 확인
            if (!prodResp.data.image) {
                console.log("이미지 데이터가 없습니다");
                return;
            }

            // 기존 이미지 URL 설정
            const existingImageUrls = prodResp.data.image.map(
                (imageName) => `/product/${imageName}`
            );
            setExistingImages(existingImageUrls);

            // 기존의 미리보기 이미지 설정 부분 제거
            setImages([]);  // 새 이미지 배열 초기화
            setPreviewImages([]); // 미리보기 배열 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // 파일 입력 초기화
            }

            setProductData({
                productid: prodResp.data.id,
                productname: prodResp.data.productname,
                seller: prodResp.data.seller,
                price: prodResp.data.price,
                discount: prodResp.data.discount,
                type: prodResp.data.type,
                unit: prodResp.data.unit,
                subtitle: prodResp.data.subtitle,
                description: prodResp.data.description,
            });

        } catch (error) {
            console.error('상품 정보 조회 실패:', error);
            navigate("/");
        }
    };

    useEffect(() => {
        if (!productid) {
            console.error("Error: Product ID is missing.");
            navigate("/");
            return;
        }

        const checkLoginStatus = async () => {
            try {
                const userResp = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // 로그인 안되어있거나 SELLER/ADMIN이 아닌 경우 접근 불가
                if (!userResp.data.isAuthenticated ||
                    (!userResp.data.roles.includes('ROLE_ADMIN') && !userResp.data.roles.includes('ROLE_SELLER'))) {
                    navigate("/");
                    return;
                }

                setIsLogin(true);
                setUserId(userResp.data.userId);
                setUserRole(userResp.data.roles);
                await getProduct(productid, userResp.data.userId, userResp.data.roles);

            } catch (error) {
                console.error('인증 확인 실패:', error);
                navigate("/");
            }
        };

        checkLoginStatus();
    }, [productid, navigate]);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // 기존 미리보기 URL 해제
        previewImages.forEach(url => {
            // URL이 createObjectURL로 생성된 것인 경우에만 해제
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });

        // 새로운 미리보기 URL 생성
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];

        // URL이 createObjectURL로 생성된 것인 경우에만 해제
        if (newPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(newPreviews[index]);
        }

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setPreviewImages(newPreviews);

        if (newImages.length === 0) {
            fileInputRef.current.value = '';
        }

        const dataTransfer = new DataTransfer();
        newImages.forEach(file => {
            dataTransfer.items.add(file);
        });

        fileInputRef.current.files = dataTransfer.files;
    };

    const handleRemoveExistingImage = (index, imageName) => {
        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        setExistingImages(newExistingImages);

        // 삭제할 이미지 이름 저장
        setImagesToDelete(prev => [...prev, imageName]);
    };

    // 상품 업데이트 핸들러
    const updateHandler = async (e) => {
        e.preventDefault();

        if (!productData.productname.trim() || !productData.price || !productData.type ||
            !productData.unit.trim() || !productData.subtitle.trim() || !productData.description.trim()) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        if (isNaN(productData.price) || productData.price <= 0) {
            alert("유효한 가격을 입력해주세요.");
            return;
        }

        if (productData.discount && (isNaN(productData.discount) || productData.discount < 0 || productData.discount > 100)) {
            alert("할인율은 0에서 100 사이의 숫자여야 합니다.");
            return;
        }

        const formData = new FormData();
        const pData = {
            id: productid,
            seller: productData.seller,
            productname: productData.productname,
            price: productData.price,
            discount: productData.discount || 0,
            type: productData.type,
            unit: productData.unit,
            subtitle: productData.subtitle,
            description: productData.description,
            imagesToDelete: [...imagesToDelete, ...existingImages.map(url => url.split('/').pop())]
        };

        formData.append("data", new Blob([JSON.stringify(pData)], { type: "application/json" }));

        // 새 이미지가 있으면 새 이미지를, 없으면 기존 이미지를 전송
        if (images.length > 0) {
            // 새로운 이미지가 있는 경우
            images.forEach((image) => formData.append('images', image));
        } else if (existingImages.length > 0) {
            // 새 이미지는 없고 기존 이미지만 있는 경우
            // 기존 이미지 URL에서 파일을 가져와서 전송
            try {
                const imagePromises = existingImages.map(async imageUrl => {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    return new File([blob], imageUrl.split('/').pop(), { type: blob.type });
                });

                const imageFiles = await Promise.all(imagePromises);
                imageFiles.forEach(file => formData.append('images', file));
            } catch (error) {
                console.error('기존 이미지 파일 변환 실패:', error);
                alert('이미지 처리 중 오류가 발생했습니다.');
                return;
            }
        } else {
            // 이미지가 하나도 없는 경우
            alert("최소 한 개의 이미지가 필요합니다.");
            return;
        }

        try {
            const response = await axios.put('http://localhost:8090/product/edit/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert('상품 정보가 성공적으로 수정되었습니다.');
                navigate(`/`);
            } else {
                alert('상품 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('상품 수정 중 오류가 발생했습니다.');
        }
    };

    // 상품 삭제 핸들러
    const deleteHandler = async (e) => {
        e.preventDefault();
        const deleteId = productid;
        try {
            const response = await axios.delete(`http://localhost:8090/product/edit/delete/${deleteId}`);
            if (response.status === 200) {
                navigate('/');
                alert('상품이 성공적으로 삭제되었습니다.');
            } else {
                alert('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="product-register-container">
            <h2>상품 편집</h2>
            <form onSubmit={updateHandler} className="product-register-form">
                <div className="form-group">
                    <label>상품명</label>
                    <input
                        type="text"
                        name="productname"
                        value={productData.productname}
                        onChange={handleInputChange}
                        required
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
                        placeholder="설향딸기"
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
                        placeholder="예: NEW! 12월 신상품! 7종 (택1)"
                        autoComplete="off"
                    />
                </div>

                <div className="image-upload-section">
                    {/* 기존 이미지 표시 */}
                    {existingImages.length > 0 && (
                        <div className="existing-images">
                            <h4>기존 이미지</h4>
                            <div className="image-preview-container">
                                {existingImages.map((imageUrl, index) => (
                                    <div key={`existing-${index}`} className="image-preview-item">
                                        <img src={imageUrl} alt={`기존 이미지 ${index + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index, imageUrl.split('/').pop())}
                                            className="remove-image-btn"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 새 이미지 업로드 */}
                    <div className="new-images">
                        <h4>새 이미지 업로드</h4>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />

                        <div className="image-preview-container">
                            {previewImages.map((preview, index) => (
                                <div key={`new-${index}`} className="image-preview-item">
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
                </div>

                <button type="submit" className="submit-button">
                    상품 수정
                </button>
                <button type="button" className="submit-button" onClick={() => navigate('/admin/products')}>취소</button>
            </form>
{/* 
            <form onSubmit={deleteHandler} className="product-register-form">
                <button type="submit" className="submit-button">
                    상품 삭제
                </button>
            </form> */}
        </div>
    );
}

export default ProductEdit;
