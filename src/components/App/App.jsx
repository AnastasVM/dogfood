import Header from '../Header/Header';
import { useCallback, useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import Footer from '../Footer/Footer';
import api from "../../utils/api";
import SearchInfo from '../SearchInfo/SearchInfo';
import useDebounce from '../../hooks/useDebounce';
import { isLiked } from '../../utils/products';
import { Route, Routes, useLocation } from 'react-router-dom';
import CatalogPage from '../../pages/CatalogPage/CatalogPage';
import ProductPage from '../../pages/ProductPage/ProductPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import { UserContext } from '../../context/userContext';
import { CardContext } from '../../context/cardContext';
import FavouritesPage from '../../pages/FavouritesPage/FavouritesPage';
import RegistrationForm from '../Forms/RegistrationForm/RegistrationForm';
import Modal from '../Modal/Modal';
import LoginForm from '../Forms/LoginForm/LoginForm';
import ResetPasswordForm from '../Forms/ResetPasswordForm/ResetPasswordForm';

function Application() {
   
    const [cards, setCards] = useState([]);
    //хранит данные избранное(есть лайки), далее пробрасываем в контекст
    const [favourites, setFavourites] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');
    // спинер
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    // сохраняем в переменную вывод вводимой строки с задержкой
    const debounceSearchQuery = useDebounce(searchQuery, 300);
    const location = useLocation();
    // создаем переменные, кот. как аргументы пробросим в роутер (модальные окна)
    // стейт есть у локейшена всегда, а бекграундЛокейшен и initialPath есть не всегда, поэтому ставим ? проверку, если есть
    const backgroundLocation = location.state?.backgroundLocation;
    const initialPath = location.state?.initialPath;

    const addContact = (contactInfo) => {
        setContacts([...contacts, contactInfo]);
    }
   
    useEffect(() => {
        setIsLoading(true);
        Promise.all([api.getUserInfo(), api.getProductList()])
        //  then принимает массив, нейминг соответствует передающимся элементам
         .then(([userData, cardData]) => {
            setCurrentUser(userData);
            setCards(cardData.products);
            // Пполученные данные с сервера сразу отфильтруем карточки у которых стоит лайк и положим в массив/item -каждая карточка товара
            const favouritesProducts = cardData.products.filter(item => isLiked(item.likes, userData._id));
            setFavourites(favouritesProducts);
         })
         .catch(err => console.log(err))
        //  пока не подгрузились данные из сервера показывается спинер
         .finally(() => {
            setIsLoading(false)
        })
    }, []);

    // при вводе данных пользователем searchQuery меняется (сделали с задержкой, поэтому передаем debounceSearchQuery) и с его изменениями нужно запустить handleRequest функцию
    useEffect(() => {
        handleRequest();
    }, [debounceSearchQuery]);

    // функция работает с данными сервера/функция запроса
    const handleRequest = () => {
        setIsLoading(true);       
        // когда мы будем вызывать ф-цию, будем печатать текст, он будет приходить в строку searchQuery, мы отправляем его на сервер и сервер возвращает нам данные с этими карточками и  мы их записываем в стейт, стейт изменится и реакт поймет, что нужно перерендерить наш дом.
        api.search(debounceSearchQuery).then(data => {
        setCards(data);
        // если будет ошибка
        }).catch(err => console.log(err))
        .finally(() => {
            setIsLoading(false);
        })
    }

    // функция будет брать данные из формы/во время поиска при нажатии на лупу, вызыввем функцию и отменяем поведение браузера по умолчанию
    function handleFormSubmit(e) {
        e.preventDefault();
        handleRequest();
    }

    // console.log(searchQuery);

    // функция будет брать данные из импута
    const handleInputChange = (inputValue) => {
        // инпутвелью записываем в стейт
        setSearchQuery(inputValue)
    }

    // изменении данных о пользователе
    const handleUpdateUser = (userUpdate) => {
        api.setUserInfo(userUpdate).then((newUserData) => {
            setCurrentUser(newUserData);
        })
    }

    // функция обработчик события, кот. будет висет на сердечке и по клику на него что-то делать/функции отвечающие за какие-то события (клик на кнопку) называют с ключевого слова headle
    const handleProductLike = useCallback((product) => {
        // нужно в массиве likes (id пользователей кот. лайкнули этот товар) искать id текущего кользователя, если она существует, то лайк надо поставить, если ее нет, то не ставим/
        const liked = isLiked(product.likes, currentUser._id);
        //  в зависимости от того есть ли лайки или нет отправляем запрос "DELETE" или "PUT"/ !isLiked - это фолс
        return api.changeLikeProduct(product._id, liked).then((newCard) => { 
            // чтобы не делать доп. запрос для получения карточек с актуальными лайками мы текущие карточки, кот есть на клиенте перебираем и при выполении условия получаем:
                const newCards = cards.map((card) => {
                // если карточка старая совпадаем с новой карточкой (то что ответил сервер после изменения лайка newCard) то берем новую, если нет - старую
                return card._id === newCard._id ? newCard : card;
            })
            // если карточка новая и она была не лайкнута, то берем массив карточек старых и в него добавляем новую карточку
            if (!liked) {
                setFavourites(prevState => [...prevState, newCard])
        } else {
            // а если новая карточка была лайкнута, то ее нужно удалить из массива, для этого используем фильтр (вернет новый массив всего, что вернет истину в скобках)
                setFavourites(prevState => prevState.filter(card => card._id !== newCard._id));
        }
            // получившейся массив пишем в стейт
            setCards(newCards);
            return newCard
        })
    }, [cards, currentUser])

    return (
        // value это обязательное поле - это объект (ключ: значение)/ Внедняем данные из стейта currentUser с помощью провайдера контекста/ Всем дочерним элементам доступен контекст
        <UserContext.Provider value={{user: currentUser, isLoading}}>
            <CardContext.Provider value={{cards, favourites, handleLike: handleProductLike, isLoading}}>
            {/* пока пробросим текущего и обновленного пользователя сюда */}
            <Header user={currentUser} updateUserHandle={handleUpdateUser}>
                <Logo className='logo logo_place_header' href='/'/>

                <Routes>
                    {/* Если путь будет / то возьми и зарендери элемент поиска (на отдельной странице товара его не будет) */}
                    <Route path="/" element={
                         <Search onInput={handleInputChange} onSubmit={handleFormSubmit}/>
                    }/>
                </Routes>
            </Header>
            {/* чтобы футер прилип книзу */}
            <main className='content container'>
                {/* принимает кол-во карточек и введеный текст */}
                <SearchInfo searchCount={cards.length} searchText={searchQuery}/>
                {/* делаем роутинг модальных окон/условие, если бекграундЛокейшен есть, то возьми все, что внутри него, развернули рест оператором и в pathname пробросим initialPath если он есть, а иначе возьми свой обычный локейшен  */}
                <Routes location={(backgroundLocation && {...backgroundLocation, pathname: initialPath} ) || location}>
                    {/* параметр path="/" это тоже самое, что index/указываем какой элемент нам нужно рендерить если пользователь запрашивает корневую страницу сайта (localhost:3000/) и прокидываем в него пропсы */}
                    <Route index element={<CatalogPage />}/>
                    {/* Хотим чтобы передавались динамически параметры и хук useParams доставал эти значения/именно по данному ключу productId в компоненте страницы будем доставать эту id */}
                    <Route path="/product/:productId" element={<ProductPage />}/>
                    <Route path="/favourites" element={<FavouritesPage/>}/>
                    <Route path="/login" element={<LoginForm/>} />
                    <Route path="/registration" element={<RegistrationForm/>}/>
                    <Route path="/reset-password" element={<ResetPasswordForm/>}/>
                    {/* когда мы делаем запрос на рендер какого-т компонента по какому-то пути, то реакт роутер дом внутри ищет указанный url и если его не найдет, то даст path="*" 'это страница 404 ошибка */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
                {/* выше был роутинг для прямых ссылок, а в том месте, где в Hedere мы нажимаем на иконку UserIcon нужно подменить роутер на тот, который будет работать с модалками/ в усах пишем условие, если бекграундЛокейшен есть (который мы создали вручную), то тогда.../когда кликаем на войти (собаку) мы подменяем локейшен у роута, т.е. источник правды для его роутов, теперь правда - это бекграундЛокейшен, а не то, что в урле */}
                {backgroundLocation && (
                    <Routes>
                        <Route path='/login' element={
                            <Modal>
                                {/*  форма может принимать стейт - пропсом/пробрасываем в него объект */}
                                <LoginForm linkState={{backgroundLocation: location, initialPath}} />
                            </Modal>
                        }/>
                         <Route path='/registration' element={
                            <Modal>
                                <RegistrationForm linkState={{backgroundLocation: location, initialPath}} />
                            </Modal>
                        }/>
                        <Route path='/reset-password' element={
                            <Modal>
                                <ResetPasswordForm linkState={{backgroundLocation: location, initialPath}} />
                            </Modal>
                        }/>
                    </Routes>
                )}

            </main>   
            <Footer/> 
            </CardContext.Provider>
        </UserContext.Provider>
    )
}

export default Application;
