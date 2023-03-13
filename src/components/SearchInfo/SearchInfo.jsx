import s from "./SearchInfo.module.css";

// показывает сколько товаров найдено по поиску (вводит пользователь)
// принимает то, что пишем в поисковой строке и найденное колличество товаров
const SearchInfo = ({searchText, searchCount}) => {
    return (
        // если текст есть то сделаем секцию
        searchText && <section className={s.searchTitle}>
            По запросу <span className={s.boldText}>{searchText}</span> найдено {searchCount} товаров
        </section>
    );
};

export default SearchInfo;
