// s - это стиль, объект, ключ - название класса
import s from './Header.module.css';
// cn - название функции, может быть разным, но принято называть так
import cn from 'classnames';


const Header = ({user, updateUserHandle, children}) => {

    const handleClickButtonEdit = (e) => {
        e.preventDefault();
        // сейчас захаркодили, по клику данные должны приходить с формы
        updateUserHandle({name: "Анастасия Мысник", about: 'Ученик'});
    }
  
    return (
        <header className={cn(s.header)}>
            <div className="container">
                {/* условие: если почта придет, то спан покажется/user?.email  означает,что если user есть то тогда возьми от него email...эта запись эквивалентна записи: user !== null */}
                {user?.email && <span>{user?.email}</span>}
                {/* тоже условие что выше, только другой синтаксис */}
                {user?.name ? <span>{user?.name}</span> : null}

                {/* кнопка по которой будем менять */}
                <button onClick={handleClickButtonEdit}>Изменить</button>

                <div className={s.wrapper}>
                    {children}
                </div>
            </div>
        </header>
    )
}

export default Header;
