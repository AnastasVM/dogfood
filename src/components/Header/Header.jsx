// s - это стиль, объект, ключ - название класса
import s from './Header.module.css';
// cn - название функции, может быть разным, но принято называть так
import cn from 'classnames';


const Header = ({children}) => {
    return (
        <header className={cn(s.header)}>
            <div className="container">
                <div className={s.wrapper}>
                    {children}
                </div>
            </div>
        </header>
    )
}

export default Header;
