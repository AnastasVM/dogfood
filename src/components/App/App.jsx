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
import { useDispatch } from 'react-redux';
import { getAllProductsThunk } from '../../redux/redux-thunk/products-thunk/getAllProductsThunk';
import { getUserInfoThunk } from '../../redux/redux-thunk/user-thunk/getUserInfoThunk';

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

    const dispatch = useDispatch();

    useEffect(() => {
        // дождемся, когда промис с информацией о пользователе выполнится, а только потом дернем все продукты (тогда все лайки и прочие не слетят)
       const userData =  dispatch(getUserInfoThunk());
       userData.then(()=> {
        dispatch(getAllProductsThunk());
       })
    }, [dispatch]);

    // при вводе данных пользователем searchQuery меняется (сделали с задержкой, поэтому передаем debounceSearchQuery) и с его изменениями нужно запустить handleRequest функцию
    useEffect(() => {
        handleRequest();
    }, [debounceSearchQuery]);

    // функция работает с данными сервера/функция запроса
    const handleRequest = () => {
        // setIsLoading(true);       
        // когда мы будем вызывать ф-цию, будем печатать текст, он будет приходить в строку searchQuery, мы отправляем его на сервер и сервер возвращает нам данные с этими карточками и  мы их записываем в стейт, стейт изменится и реакт поймет, что нужно перерендерить наш дом.
        api.search(debounceSearchQuery).then(data => {
        setCards(data);
        // если будет ошибка
        }).catch(err => console.log(err))
        .finally(() => {
            // setIsLoading(false);
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

    return (
       <>
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
        </>
    )
}

export default Application;
