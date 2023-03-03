// s - это стиль, объект, ключ - название класса
import s from './Header.module.css';
// cn - название функции, может быть разным, но принято называть так
import cn from 'classnames';
import { Link } from 'react-router-dom';
import {ReactComponent as FavouriteIcon} from './img/favorites.svg';
import { useContext } from 'react';
import { CardContext } from '../../context/cardContext';


const Header = ({user, updateUserHandle, children}) => {

    const { favourites } = useContext(CardContext);

    // const handleClickButtonEdit = (e) => {
    //     e.preventDefault();
    //     // сейчас захаркодили, по клику данные должны приходить с формы
    //     updateUserHandle({name: "Анастасия Мысник", about: 'Ученик'});
    // }
  
    return (
        <header className={cn(s.header, 'cover')}>
            <div className="container">
                {/* условие: если почта придет, то спан покажется/user?.email  означает,что если user есть то тогда возьми от него email...эта запись эквивалентна записи: user !== null */}
                {/* {user?.email && <span>{user?.email}</span>} */}
                {/* тоже условие что выше, только другой синтаксис */}
                {/* {user?.name ? <span>{user?.name}</span> : null} */}

                {/* кнопка по которой будем менять */}
                {/* <button onClick={handleClickButtonEdit}>Изменить</button> */}

                <div className={s.wrapper}>
                    {children}
                    <div className={s.iconsMenu}>
                        <Link className={s.favouritesLink} to='/favourites'>
                            <FavouriteIcon/>
                            {/* если длина массива лайков не равна 0, то берем обычный спан */}
                            {favourites.length !== 0 && <span className={s.iconBubble}>{favourites.length}</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
