import Header from '../Header/Header';
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import Footer from '../Footer/Footer';
import api from "../../utils/api";
import SearchInfo from '../SearchInfo/SearchInfo';
import useDebounce from '../../hooks/useDebounce';
import { Route, Routes, useLocation } from 'react-router-dom';
import CatalogPage from '../../pages/CatalogPage/CatalogPage';
import ProductPage from '../../pages/ProductPage/ProductPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import FavouritesPage from '../../pages/FavouritesPage/FavouritesPage';
import RegistrationForm from '../Forms/RegistrationForm/RegistrationForm';
import Modal from '../Modal/Modal';
import LoginForm from '../Forms/LoginForm/LoginForm';
import ResetPasswordForm from '../Forms/ResetPasswordForm/ResetPasswordForm';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsThunk } from '../../redux/redux-thunk/products-thunk/getAllProductsThunk';
import FAQPage from '../../pages/FAQPage/FAQPage';
import MainPage from '../../pages/MainPage/MainPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { checkTokenThunk } from '../../redux/redux-thunk/user-thunk/checkTokenThunk';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import { getSearchQueryThunk } from '../../redux/redux-thunk/products-thunk/getSearchQueryThunk';

function Application() {
    //хранит данные избранное(есть лайки), далее пробрасываем в контекст
    const [currentUser, setCurrentUser] = useState(null);
    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');
    const { products} = useSelector(state => state.products);
    // сохраняем в переменную вывод вводимой строки с задержкой
    const debounceSearchQuery = useDebounce(searchQuery, 300);
    const location = useLocation();
    // создаем переменные, кот. как аргументы пробросим в роутер (модальные окна)
    // стейт есть у локейшена всегда, а бекграундЛокейшен и initialPath есть не всегда, поэтому ставим ? проверку, если есть
    const backgroundLocation = location.state?.backgroundLocation;
    const initialPath = location.state?.initialPath;

    const dispatch = useDispatch();

    // достаем токен из локалсторож и прокидываем его в checkTokenThunk
    const token = localStorage.getItem('jwt');
    console.log('token---->', token);

    useEffect(() => {
        // дождемся, когда промис с информацией о пользователе выполнится, а только потом дернем все продукты (тогда все лайки и прочие не слетят)
       const userData =  dispatch(checkTokenThunk(token));
        // если токен есть, тогда данные доступны
        if (token) {
            userData.then(()=> {
                // отправляем запрос за всеми постами и пробрасываем актуальный токен
                dispatch(getAllProductsThunk(token));
            }) 
        }
      
    }, [dispatch, token]);

    // при вводе данных пользователем searchQuery меняется (сделали с задержкой, поэтому передаем debounceSearchQuery) и с его изменениями нужно запустить handleRequest функцию
    useEffect(() => {
        if (token) {
            handleRequest();
            console.log('INPUT', debounceSearchQuery)
        }
    }, [debounceSearchQuery]);

    // функция работает с данными сервера/функция запроса
    const handleRequest = async () => {
        // searchQuary: debounceSearchQuery так пишется, т.к. нужно передать ключ и значение этого параметра, если просто debounceSearchQuery, то не сработает, так как это означает debounceSearchQuery:debounceSearchQuery, а санках ждут searchQuary
        await dispatch(getSearchQueryThunk({searchQuary: debounceSearchQuery, token}));   
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

    return (
       <>
            <Header user={currentUser} updateUserHandle={handleUpdateUser}>
                <Logo className='logo logo_place_header' href='/'/>

                <Routes>
                    {/* Если путь будет / то возьми и зарендери элемент поиска (на отдельной странице товара его не будет) */}
                    <Route path="/catalog" element={
                         <Search onInput={handleInputChange} onSubmit={handleFormSubmit}/>
                    }/>
                </Routes>
            </Header>
            {/* чтобы футер прилип книзу */}
            <main className='content'>
                {/* принимает кол-во карточек и введеный текст */}
                <SearchInfo searchCount={products.length} searchText={searchQuery}/>
                {/* делаем роутинг модальных окон/условие, если бекграундЛокейшен есть, то возьми все, что внутри него, развернули рест оператором и в pathname пробросим initialPath если он есть, а иначе возьми свой обычный локейшен  */}
                <Routes location={(backgroundLocation && {...backgroundLocation, pathname: initialPath} ) || location}>
                    {/* параметр path="/" это тоже самое, что index/указываем какой элемент нам нужно рендерить если пользователь запрашивает корневую страницу сайта (localhost:3000/) и прокидываем в него пропсы */}
                    <Route index element={<MainPage />}/>
                    <Route path='/catalog' element={
                            <CatalogPage />
                    }/>
                    {/* Хотим чтобы передавались динамически параметры и хук useParams доставал эти значения/именно по данному ключу productId в компоненте страницы будем доставать эту id */}
                    <Route path="/product/:productId" element={
                            <ProductPage />
                    }/>
                    <Route path="/favourites" element={<FavouritesPage/>}/>
                    <Route path="/profile" element={
                        // оборачиваем страницу с информацией о пользователе в протектор роут(в 6 версии именно так, т.к. дочки Routes м.б.только Route, поэтому просто роут обернуть нельзя), пока человек не прошел авторизацию
                        <ProtectedRoute>
                            <ProfilePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/login" element={
                        // в реакте если мы передаем пропс isOnlyAuth нам не нужно передавать true, т.е. писать isOnlyAuth={true} достаточно передать просто название ключа, это равнозначная записать, а если нужно false, то это нужно писать
                        <ProtectedRoute isOnlyAuth>
                            <LoginForm/>
                        </ProtectedRoute>
                    } />
                    <Route path="/faq" element={<FAQPage/>} />
                    <Route path="/registration" element={
                        <ProtectedRoute isOnlyAuth>
                            <RegistrationForm/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/reset-password" element={
                        <ProtectedRoute isOnlyAuth>
                            <ResetPasswordForm/>
                        </ProtectedRoute>
                    }/>
                    {/* когда мы делаем запрос на рендер какого-т компонента по какому-то пути, то реакт роутер дом внутри ищет указанный url и если его не найдет, то даст path="*" 'это страница 404 ошибка */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
                {/* выше был роутинг для прямых ссылок, а в том месте, где в Hedere мы нажимаем на иконку UserIcon нужно подменить роутер на тот, который будет работать с модалками/ в усах пишем условие, если бекграундЛокейшен есть (который мы создали вручную), то тогда.../когда кликаем на войти (собаку) мы подменяем локейшен у роута, т.е. источник правды для его роутов, теперь правда - это бекграундЛокейшен, а не то, что в урле */}
                {backgroundLocation && (
                    <Routes>
                        <Route path='/login' element={
                            <ProtectedRoute isOnlyAuth>
                                <Modal>
                                    {/*  форма может принимать стейт - пропсом/пробрасываем в него объект */}
                                    <LoginForm linkState={{backgroundLocation: location, initialPath}} />
                                </Modal>
                            </ProtectedRoute>
                        }/>
                         <Route path='/registration' element={
                            <ProtectedRoute isOnlyAuth>
                                <Modal>
                                    <RegistrationForm linkState={{backgroundLocation: location, initialPath}} />
                                </Modal>
                            </ProtectedRoute>
                        }/>
                        <Route path='/reset-password' element={
                            <ProtectedRoute isOnlyAuth>
                                <Modal>
                                    <ResetPasswordForm linkState={{backgroundLocation: location, initialPath}} />
                                </Modal>
                            </ProtectedRoute>
                        }/>
                    </Routes>
                )}

            </main>   
            <Footer/> 
        </>
    )
}

export default Application;
