import { Route, Routes } from 'react-router-dom';
import Register from '../user/Register';
import Cart from '../user/Cart';
import Login from '../user/Login';
import FindId from '../user/FindId';
import FindPassword from '../user/FindPassword';
import ResetPw from '../user/ResetPw';
import MyPage from '../user/MyPage';

function UserRoutes() {
    return (
        <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/find'>
                <Route path='id' element={<FindId />} />
                <Route path='pw' element={<FindPassword />} />
            </Route>
            <Route path='/resetpw' element={<ResetPw/>} />
            <Route path='/mypage' element={<MyPage/>} />
        </Routes>
    );
}

export default UserRoutes; 