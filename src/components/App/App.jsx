import s from './App.module.css';
import Header from '../Header/Header';
import CardList from '../CardList/CardList'
import { useEffect, useState } from 'react';
// import data from '../../assets/data.json';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import Footer from '../Footer/Footer';
// import Button from '../Button/Button';
import api from "../../utils/api";
import SearchInfo from '../SearchInfo/SearchInfo';
import useDebounce from '../../hooks/useDebounce';
import { isLiked } from '../../utils/products';
import Spinner from '../Spiner/Spiner';
import Card from '../Card/Card';


function Application() {
   
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');
    // спинер
    const [isLoading, setIsLoading] = useState(false);

    // сохраняем в переменную вывод вводимой строки с задержкой
    const debounceSearchQuery = useDebounce(searchQuery, 300);

   
    useEffect(() => {
        setIsLoading(true);
        Promise.all([api.getUserInfo(), api.getProductList()])
        //  then принимает массив, нейминг соответствует передающимся элементам
         .then(([userData, cardData]) => {
            setCurrentUser(userData);
            setCards(cardData.products);
         })
         .catch(err => console.log(err))
        //  пока не подгрузились данные из сервера показывается спинер
         .finally(() => {
            setIsLoading(false)
        })

        // данный подход не очень хорош, т.к. отрисовка например карточек будет зависить от пользователя. Если делаем два отдельных промиса кто-то выполнится раньше, кто-то позже, все может зависнуть и поломаться. Поэтому лучше использовать метод  Promise.all: мы отправим пачку промисов, дождемся пока они все выполнятся и тогда проблемм не будет
        // useEffect(() => {
        // если получили успешный ответ от сервера (данные пользователя пришли userData), то ч/з then мы ими оперируем, нам необходимо ее положить в стейт (заводим отдельный стейт currentUser)
        // api.getUserInfo().then((userData) => {
        //     setcarrentUser(userData);
        // })
        // запрос уходит за продуктами
        // api.getProductList().then((cardData) => {
            // приходит объект total, а нам нужно достать products
            // console.log('cardData--->', cardData);
        // запишем в наши карточки
        // setCards(cardData.products);
        // })
        // пустой массив зависимостей, чтобы выполнилось 1 раз
    }, []);

    // при вводе данных пользователем searchQuery меняется (сделали с задержкой, поэтому передаем debounceSearchQuery) и с его изменениями нужно запустить handleRequest функцию
    useEffect(() => {
        handleRequest();
        // console.log('INPUT', debounceSearchQuery)
    }, [debounceSearchQuery]);

    // функция работает с данными сервера/функция запроса
    const handleRequest = () => {
        setIsLoading(true);
        // когда будет осуществляться поиск мы будем идти в базу данных товаров (data)/item - товары/проверяем нашу введенную строку searchQuery если она будет содержаться в имени (методом подстрок includesбудет искать searchQuery), если по условию будет true, то это вернется в массив filterCard/перевели все строки в верхний регистр
        // const filterCard = data.filter(item => item.name.toUpperCase().includes(searchQuery.toUpperCase()));

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
    const handleProductLike = (product) => {
        // нужно в массиве likes (id пользователей кот. лайкнули этот товар) искать id текущего кользователя, если она существует, то лайк надо поставить, если ее нет, то не ставим/
        const liked = isLiked(product.likes, currentUser._id);
        //  в зависимости от того есть ли лайки или нет отправляем запрос "DELETE" или "PUT"/ !isLiked - это фолс
        api.changeLikeProduct(product._id, liked).then((newCard) => { 
            // чтобы не делать доп. запрос для получения карточек с актуальными лайками мы текущие карточки, кот есть на клиенте перебираем и при выполении условия получаем:
            const newCards = cards.map((card) => {
                // console.log('Карточка в переборе', card);
                // console.log('Карточка с сервера', newCard);

                // если карточка старая совпадаем с новой карточкой (то что ответил сервер после изменения лайка newCard) то берем новую, если нет - старую
                return card._id === newCard._id ? newCard : card;
            })
            // получившейся массив пишем в стейт
            setCards(newCards);
        })
    }

    // Инлайноввй стиль в JSX/примеры
    // const margin = 50;
    // const StyleHead = {
    //     color: "red",
    //     marginTop: "20px",
    //     marginBottom: `${margin}px`
    // }

    return (
        <>
            {/* пока пробросим текущего и обновленного пользователя сюда */}
            <Header user={currentUser} updateUserHandle={handleUpdateUser}>
                <Logo className='logo logo_place_header' href='/'/>
                <Search onInput={handleInputChange} onSubmit={handleFormSubmit}/>
            </Header>

            {/* чтобы футер прилип книзу */}
            <main className='content container'>
                {/* принимает кол-во карточек и введеный текст */}
                <SearchInfo searchCount={cards.length} searchText={searchQuery}/>
                {/* если  isLoading тру, то показывай спинер, а иначе карточки*/}
                 {isLoading ? (
                       <Spinner /> 
                 ) : (

                //  {/* пробрасываем лайки и  текущего юзера, чтобы смотреть его id */}
                    <CardList goods={cards} onProductLike={handleProductLike} currentUser={currentUser}/>
                 ) }
               
                {/* Примеры classnames принимаем стили с условием */}
                {/* <Button type="primary">Купить</Button>
                <Button type="secondary">Оплатить</Button> */}

                {/* Инлайновый стиль в JSX/примеры */}
                {/* <h1 style={{color: "red",fontSize: "12px"}}>Стилизованный заголовок</h1> 
                    <h1 style={StyleHead}>Стилизованный заголовок</h1> 
                */}
            </main>
                
            <Footer/>
           
        </>
    )
}

export default Application;
