import React, { useContext } from "react";
import api from "../../utils/api";
import { isLiked } from "../../utils/products";
import Spinner from "../../components/Spiner/Spiner";
import { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import s from '../../components/Product/Product.module.css';
import { useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { UserContext } from "../../context/userContext";


const ProductPage = () => {
    const [product, setProduct] = useState([]);
    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');
    // спинер
    const [isLoading, setIsLoading] = useState(false);
    // выводить лист ошибки
    const [isError, setIsError] = useState(false);

    const { productId }  = useParams();
    // console.log(productId);
    const { user: currentUser } = useContext(UserContext);

    useEffect(() => {
        setIsLoading(true);
        api.getProductById(productId)
        //  then принимает массив, нейминг соответствует передающимся элементам
         .then(( productData) => {
            setProduct(productData);
         })
         .catch(err => {
            console.log(err)
            setIsError(true);
        })
        //  пока не подгрузились данные из сервера показывается спинер
         .finally(() => {
            setIsLoading(false)
        })
    }, []);

    // функция работает с данными сервера/функция запроса
    const handleRequest = () => {
        // когда мы будем вызывать ф-цию, будем печатать текст, он будет приходить в строку searchQuery, мы отправляем его на сервер и сервер возвращает нам данные с этими карточками и  мы их записываем в стейт, стейт изменится и реакт поймет, что нужно перерендерить наш дом.
        api.search(searchQuery).then(data => {
        setProduct(data);
        }).catch(err => console.log(err));
    }

     // функция обработчик события, кот. будет висеть на сердечке и по клику на него что-то делать/функции отвечающие за какие-то события (клик на кнопку) называют с ключевого слова headle
     const handleProductLike = () => {
        // нужно в массиве likes (id пользователей кот. лайкнули этот товар) искать id текущего кользователя, если она существует, то лайк надо поставить, если ее нет, то не ставим/
        const liked = isLiked(product.likes, currentUser._id);
        //  в зависимости от того есть ли лайки или нет отправляем запрос "DELETE" или "PUT"/ !isLiked - это фолс
        api.changeLikeProduct(product._id, liked).then((updateCard) => { 
            // новую карточку с лайком или без обновляем в стейт
            setProduct(updateCard);
        })
    }

    return (
        <>
            {isLoading ? (
                <div className={s.wrapperLoader}>
                     <Spinner /> 
                </div>
                      
            ) : (
                // если ошибки нет, то показываем нашу страницу продукта, а если есть покажем NotFound, а иначе нал
                !isError && <Product {...product} currentUser={currentUser} onProductLike={handleProductLike}/>
                )}
                {isError ? (
                    <NotFoundPage/>
                ) : null}
        </>
    )
};

export default ProductPage;