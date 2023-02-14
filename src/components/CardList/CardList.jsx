import './index.css';
import Card from '../Card/Card';
// import data from '../../assets/data.json';

// Будет отрисовывать все карточки, который приходят с сервера
const CardList = ({goods}) => {
  
    return (
        <div className='cards'>
           {goods.map((el, index) => {
            return (
                // Рестоператор (...) это аналогично записи: <Card name={el.name}/>.Все элементы, кот. есть в объекте он разворачивает и покидывает в низ.
                <Card key={index} {...el} />
            )
           })}

        </div>
    );
};

export default CardList;
