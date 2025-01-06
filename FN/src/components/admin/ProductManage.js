import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductManage.css';

function ProductManage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // 관리자 권한 체크
    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/auth/check', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.data.roles.includes('ROLE_ADMIN')) {
                    navigate('/');
                    return;
                }
            } catch (error) {
                console.error('인증 확인 실패:', error);
                navigate('/');
            }
        };

        checkAdminAuth();
    }, [navigate]);

    // 상품 목록 가져오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8090/product/listAll');
                if (Array.isArray(response.data)) {
                    const processedProducts = response.data.map(product => ({
                        ...product,
                        finalPrice: product.price * (1 - product.discount/100)
                    }));
                    setProducts(processedProducts);
                }
                setLoading(false);
            } catch (err) {
                console.error('상품 정보 조회 실패:', err);
                setError('상품 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 검색어 처리
    const filteredProducts = products.filter(product =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 페이지네이션 처리
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // 가격 포맷팅
    const formatPrice = (price) => {
        return Math.floor(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 상품 삭제 처리
    const handleDelete = async (productId) => {
        if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8090/product/edit/delete/${productId}`);
                setProducts(products.filter(product => product.id !== productId));
                alert('상품이 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('상품 삭제 실패:', error);
                alert('상품 삭제에 실패했습니다.');
            }
        }
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-manage-container">
            <h2>상품 관리</h2>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="상품명 또는 판매자로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="product-list">
                <table>
                    <thead>
                        <tr>
                            <th>상품 ID</th>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>판매자</th>
                            <th>가격</th>
                            <th>할인율</th>
                            <th>최종가격</th>
                            <th>타입</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                    <img 
                                        src={`/product/${product.image[0]}`} 
                                        alt={product.productname}
                                        className="product-thumbnail"
                                    />
                                </td>
                                <td>{product.productname}</td>
                                <td>{product.seller}</td>
                                <td>{formatPrice(product.price)}원</td>
                                <td>{product.discount}%</td>
                                <td>{formatPrice(product.finalPrice)}원</td>
                                <td>{product.type}</td>
                                <td>
                                    <div className="button-container">
                                        <button 
                                            onClick={() => navigate(`/product/edit/${product.id}`)}
                                            className="edit-button"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            수정
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="delete-button"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProductManage; 