import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8090'
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('token');
            window.location.href = '/user/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 