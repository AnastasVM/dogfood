import React, { useCallback, useEffect } from "react";
import Spinner from "../../components/Spiner/Spiner";
import Product from "../../components/Product/Product";
import s from '../../components/Product/Product.module.css';
import { useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProductThunk } from "../../redux/redux-thunk/singleProduct-thunk/getSingleProductThunk";
import { changeLikeProductThunk } from "../../redux/redux-thunk/products-thunk/changeLikeProductThunk";
import { setProductState } from "../../redux/redux-slice/singleProduct/singleProductSlice";


const ProductPage = () => {
    const { productId }  = useParams();
    const dispatch = useDispatch();
   
    const { singleProduct, isLoading, error: isError } = useSelector(state => state.singleProduct);

     useEffect(()=> {
        dispatch(getSingleProductThunk(productId))
     }, [dispatch, productId]);
          
     const handleProductLike = useCallback(() => {
        dispatch(changeLikeProductThunk(singleProduct)).then(updateProduct => {
            dispatch(setProductState(updateProduct.payload.product));
        })
    }, [dispatch, singleProduct]);

    return (
        <>
            {isLoading ? (
                <div className={s.wrapperLoader}>
                     <Spinner /> 
                </div>
                      
            ) : (
                // если ошибки нет, то показываем нашу страницу продукта, а если есть покажем NotFound, а иначе нал
                !isError && <Product {...singleProduct} onProductLike={handleProductLike}/>
                )}
                {isError ? (
                    <NotFoundPage/>
                ) : null}
        </>
    )
};

export default ProductPage;