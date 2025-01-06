import { Route, Routes } from 'react-router-dom';
import ProductAdd from '../seller/ProductAdd';
import ProductList from '../common/ProductList';
import ProductDetail from '../common/ProductDetail';
import ProductEdit from '../seller/ProductEdit';



function ProductRoutes() {
    return (
        <Routes>
            <Route path='/add' element={<ProductAdd/>}/>
            <Route path='/edit' element={<ProductEdit/>}/>
            <Route path='/list' element={<ProductList/>}/>
            <Route path='/:id' element={<ProductDetail/>}/>
            <Route path="/edit/:productid" element={<ProductEdit />} />
        </Routes>
    );
}

export default ProductRoutes; 