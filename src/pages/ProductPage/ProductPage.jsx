import React from "react";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import Header from "../../components/Header/Header";
import api from "../../utils/api";
import { isLiked } from "../../utils/products";
import Spinner from "../../components/Spiner/Spiner";
import Footer from "../../components/Footer/Footer";
import { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import s from '../../components/Product/Product.module.css';


const ProductPge = () => {
    const [product, setProduct] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');
    // спинер
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([api.getUserInfo(), api.getProductById('622c77e877d63f6e70967d22')])
        //  then принимает массив, нейминг соответствует передающимся элементам
         .then(([userData, productData]) => {
            setCurrentUser(userData);
            setProduct(productData);
         })
         .catch(err => console.log(err))
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

     // функция обработчик события, кот. будет висет на сердечке и по клику на него что-то делать/функции отвечающие за какие-то события (клик на кнопку) называют с ключевого слова headle
     const handleProductLike = () => {
        // нужно в массиве likes (id пользователей кот. лайкнули этот товар) искать id текущего кользователя, если она существует, то лайк надо поставить, если ее нет, то не ставим/
        const liked = isLiked(product.likes, currentUser._id);
        //  в зависимости от того есть ли лайки или нет отправляем запрос "DELETE" или "PUT"/ !isLiked - это фолс
        api.changeLikeProduct(product._id, liked).then((newCard) => { 
            // чтобы не делать доп. запрос для получения карточек с актуальными лайками мы текущие карточки, кот есть на клиенте перебираем и при выполении условия получаем:
            const newCards = product.map((card) => {
                // console.log('Карточка в переборе', card);
                // console.log('Карточка с сервера', newCard);

                // если карточка старая совпадаем с новой карточкой (то что ответил сервер после изменения лайка newCard) то берем новую, если нет - старую
                return card._id === newCard._id ? newCard : card;
            })
            // получившейся массив пишем в стейт
            setProduct(newCards);
        })
    }

    return (
        <>
            <Header>
                <Logo className='logo logo_place_header' href='/'/>
                <Search onSubmit={handleRequest}/>
            </Header>
            <main className='content container'>
                {isLoading ? (
                    <div className={s.wrapperLoader}>
                         <Spinner /> 
                    </div>
                      
                 ) : (
                        <Product {...product} currentUser={currentUser} onProductLike={handleProductLike}/>
                 )}
            </main>
            <Footer/>
        </>
    )
};

export default ProductPge;