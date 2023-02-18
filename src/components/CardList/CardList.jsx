import './index.css';
import Card from '../Card/Card';

// import data from '../../assets/data.json';

// Будет отрисовывать все карточки, который приходят с сервера
const CardList = ({goods, currentUser, onProductLike}) => {
  
    return (
        <div className='cards'>
           {goods.map(el => {
            return (
                // Рестоператор (...) это аналогично записи: <Card name={el.name}/>.Все элементы, кот. есть в объекте он разворачивает и покидывает в низ/во время мапа на каждую карточку навешиваем хендлер (отслеживание лайков)
                <Card key={el._id} {...el} currentUser={currentUser} onProductLike={onProductLike} />
            )
           })}

        </div>
    );
};

export default CardList;
