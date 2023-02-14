import './index.css';
// импортируй картинку (указан путь до нее) ic-search.svg как реакт компонент и назови ее (as) SearchIcon
import {ReactComponent as SearchIcon} from "./ic-search.svg";
import {ReactComponent as CloseIcon} from "./ic-close-input.svg";

// поисковая строка
// принимает функцию onSubmit, но т.к. также называется атрибут у формы, поэтому переименовываем его на propsOnSubmit
function Search({onSubmit: propsOnSubmit, onInput}) {

    // функция, возвращает то, что вводит пользователь в инпут = e.target.value
    const handleInput = (e) => {
        onInput(e.target.value);
    }

    return (
        <form className='search' onSubmit={propsOnSubmit}>
            <input type="text" className='search__input' placeholder='Поиск' onInput={handleInput}/>
            <button className='search__btn'>
                <SearchIcon/>
                {/* условный рендеринг */}
                {false &&<CloseIcon/>}
            </button>
        </form>
 
    )
}

export default Search;

