import './index.css';
import Card from '../Card/Card';
import NotFound from '../NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Будет отрисовывать все карточки, который приходят с сервера
const CardList = ({cards}) => {

   const { isLoading } = useSelector(state => state.products);
   
    const navigate = useNavigate();
  
    return (
        <>
        {/* если не найдено карточек и нет загрузки, то покажи компонет нотфаунд */}
        {!cards.length && !isLoading ? (
            <NotFound title="Простите, по вашему запросу
            товаров не надено." buttonText='Назад' buttonAction={()=> navigate(0)}/>
        ) : null}
        
        <div className='cards'>
           {cards.map(el => {
            return (
                // Рестоператор (...) это аналогично записи: <Card name={el.name}/>.Все элементы, кот. есть в объекте он разворачивает и покидывает в низ/во время мапа на каждую карточку навешиваем хендлер (отслеживание лайков)
                <Card key={el._id} {...el} />
            )
           })}
        </div>
        </>
    );
};

export default CardList;
