// s - это стиль, объект, ключ - название класса
import s from './Header.module.css';
// cn - название функции, может быть разным, но принято называть так
import cn from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {ReactComponent as FavouriteIcon} from './img/favorites.svg';
import {ReactComponent as UserIcon} from './img/profile.svg';
import {ReactComponent as Logout} from './img/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/redux-slice/user/userSlice';


const Header = ({ children, setModalOpen}) => {

    const {favourites} = useSelector(state => state.products);
    const { isAuth } = useSelector(state => state.user) 
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        //делаем релоад (перезагрузку) компонента (страницы)
        navigate(0);
    }
  
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

                        {/* если есть пользователь зарегистрирован, то он увидет иконку пользователя, а если нет, то войти */}
                        {isAuth ? (
                            <>
                            {/* если пользователь залогинин, то показывается иконка разлогиниться(выйти) /обернуть в линк, т.к. по клику будем проходить в личный кабинет */}
                            <div>
                                <Link to="profile"><UserIcon/></Link>
                            </div>
                            <div onClick={handleLogout}>
                                <Logout/>
                            </div>
                            </>
                        ): (
                            <Link to="/login" state={{
                                // чтобы осуществить роутинг по модальным окнам у линка есть стейт с объектом/ при нажатии на кнопку войти мы кладем в стейт локейшена новый стейт, сохраняем фоновый адрес backgroundLocation, ссылка обратно сохраняется
                                backgroundLocation: location,
                                // инишелПаф записала в стейт, чтобы потом обратно на него откатиться
                                initialPath: location.pathname
                            }}
                                // убрали подчеркивание с тега а
                                style={{textDecoration: 'none'}}>
                                <div className={s.wrapperEntry}>
                                    Войти
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
