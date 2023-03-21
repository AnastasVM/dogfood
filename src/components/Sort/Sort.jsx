import s from "./Sort.module.css";
import cn from "classnames";
import { sortedTabs } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { sortedProductsState } from "../../redux/redux-slice/products/productsSlice";

const Sort = () => {
    const dispatch = useDispatch();
    const { currentSort } = useSelector(state => state.products);

    // по клику на элемент сортировки она отрабатывает
    const handleSort = (id) => {
        console.log('id---->', id);
        dispatch(sortedProductsState(id));
    }

    return (
        <div className={cn(s.sort)}>
            {sortedTabs.map(({ id, title}) => (
                <div className={cn(s.sortLink, {
                    [s.sortLinkSelected] : currentSort === id,
                })}
                    id = {id}
                    key={id}
                    onClick={() => handleSort(id)}
                >
                    {title}
                </div> 
            ))}
        </div>
    );
};

export default Sort;

