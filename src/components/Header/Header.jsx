// s - это стиль, объект, ключ - название класса
import s from './Header.module.css';
// cn - название функции, может быть разным, но принято называть так
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import {ReactComponent as FavouriteIcon} from './img/favorites.svg';
import {ReactComponent as UserIcon} from './img/profile.svg';
import { useContext } from 'react';
import { CardContext } from '../../context/cardContext';


const Header = ({ children, setModalOpen}) => {

    const { favourites } = useContext(CardContext);
    const location = useLocation();
    console.log('location--->', location);
  
    return (
        <header className={cn(s.header, 'cover')}>
            <div className="container">

                <div className={s.wrapper}>
                    {children}
                    <div className={s.iconsMenu}>
                        <Link className={s.favouritesLink} to='/favourites'>
                            <FavouriteIcon/>
                            {/* если длина массива лайков не равна 0, то берем обычный спан */}
                            {favourites.length !== 0 && <span className={s.iconBubble}>{favourites.length}</span>}
                        </Link>
                        {/* если пользователь залогинин/обернуть в линк, т.к. по клику будем проходить в личный кабинет, пока без этого */}
                        <div className={s.userIcon}>
                            {/* чтобы осуществить роутинг по модальным укнам у линка есть стейт с объектом/ при нажатии на кнопку войти мы кладем в стейт локейшена новый стейт, сохраняем фоновый адрес backgroundLocation, ссылка обратно сохраняется */}
                            <Link to="/login" state={{
                                backgroundLocation: location,
                                // инишелПаф записала в срейт, чтобы потом обратно на него откатиться
                                initialPath: location.pathname
                                }}><UserIcon/></Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
