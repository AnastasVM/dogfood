import './index.css';
import Header from '../Header/Header';
import CardList from '../CardList/CardList'
import { useEffect, useState } from 'react';
import data from '../../assets/data.json';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import Footer from '../Footer/Footer';
import Button from '../Button/Button';


function Application() {
   
    const [cards, setCards] = useState(data);

    // нужно хранить строку которую вводит пользователь, ее нужно положить в стэйт
    const [searchQuery, setSearchQuery] = useState('');

    // при вводе данных пользователем searchQuery меняется и с его изменениями нужно запустить handleRequest функцию
    useEffect(() => {
        handleRequest();
    }, [searchQuery]);

    // функция работает с данными сервера/функция запроса
    const handleRequest = () => {
        // когда будет осуществляться поиск мы будем идти в базу данных товаров (data)/item - товары/проверяем нашу введенную строку searchQuery если она будет содержаться в имени (методом подстрок includesбудет искать searchQuery), если по условию будет true, то это вернется в массив filterCard/перевели все строки в верхний регистр
        const filterCard = data.filter(item => item.name.toUpperCase().includes(searchQuery.toUpperCase()));
        // записываем отфильтрованный результат в карточки, данные поменяются и далее в <CardList goods={cards}/> перерендарятся, а далее эта функция вызывается в useEffect
        setCards(filterCard);
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

    // Инлайноввй стиль в JSX/примеры
    // const margin = 50;
    // const StyleHead = {
    //     color: "red",
    //     marginTop: "20px",
    //     marginBottom: `${margin}px`
    // }

    return (
        <>
            <Header>
                <Logo className='logo logo_place_header' href='/'/>
                <Search onInput={handleInputChange} onSubmit={handleFormSubmit}/>
            </Header>

            {/* чтобы футер прилип книзу */}
            <main className='content container'>
                <CardList goods={cards}/>

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
