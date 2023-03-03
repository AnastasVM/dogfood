import React, { useCallback, useContext } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spiner/Spiner";
import Product from "../../components/Product/Product";
import s from '../../components/Product/Product.module.css';
import { useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import useApi from "../../hooks/useApi";
import { CardContext } from "../../context/cardContext";


const ProductPage = () => {
    const { productId }  = useParams();
    const { handleLike } = useContext(CardContext);
    // можно любой метод класса апи вызвать, кладем его в хендлер и пробрасываем в кастомный хук use.Api/В массив зависимостей - если изменится id, мы зайдем на другой товар, будет новый вызов метода апи
    const handleGetProduct = useCallback(() => api.getProductById(productId), [productId]);
    // при деструктурозации объекта можно любое его поле переименовать, например error на isError
    const { data: product, setData: setProduct, isLoading, error: isError } = useApi(handleGetProduct);
     // функция обработчик события, кот. будет висеть на сердечке и по клику ставит/не ставит сердечко/обернули в юсколбек (запоминает результат вызова функции колбек и если не изменился массив зависимостей, то другого результата не будет), чтобы лишний раз не делать обращение к серверу
     const handleProductLike = useCallback(() => {
        handleLike(product).then((updateProduct) => {
            setProduct(updateProduct);
        })
    }, [product, setProduct, handleLike]);

    return (
        <>
            {isLoading ? (
                <div className={s.wrapperLoader}>
                     <Spinner /> 
                </div>
                      
            ) : (
                // если ошибки нет, то показываем нашу страницу продукта, а если есть покажем NotFound, а иначе нал
                !isError && <Product {...product} onProductLike={handleProductLike}/>
                )}
                {isError ? (
                    <NotFoundPage/>
                ) : null}
        </>
    )
};

export default ProductPage;