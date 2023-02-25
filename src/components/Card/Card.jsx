import './index.css';
// достаем svg для лайков как реакт компонент
import { ReactComponent as Save} from "./save.svg";
import cn from "classnames";
import { calcDiscountPrice, isLiked} from '../../utils/products';

// использует деструкторизацию ключей объекта
const Card = ({ name, price, discount, wight, description, pictures, tags, currentUser, onProductLike, likes, _id }) => {
    // считаем прайс со скидкой/ округляем до ближайшего целого числа (ф-ция в утилитах)
    const discountPrice = calcDiscountPrice(price, discount);
    // currentUser?._id эта запись эквивалентна currentUser ? currentUser._id : '' - если юзер есть, то возьми у него id иначе ничего не берем. Если структура вложенности есть еще, то можно продолжать уточения/проверку currentUser?._id?.trolololo
    const liked = isLiked(likes, currentUser?._id);

    const handleLikeClick = () => {
        // console.log('click', isLiked);
        onProductLike({_id, likes});
    }

  return (
      <div className='card'>
        <div className='card__sticky card__sticky_type_top-left'>
            {/* скидка, делаем условный рендеринг (если discount - скидка не равна нулю, то тогда (&&) отрисуй то, что справа) */}
            {discount !== 0 && <span className='card__discount'>{`- ${discount}%`}</span>}
            {/* если теги пришли тогда переберем массив этих тегов методом map, где тег - каждый эл. массива, класс tag применить ко всем и условие: если класс есть, примени */}
            {tags && tags.map(tag => <span key={tag} className={cn('tag', {
                // можно так,как вариант с интерполяцией, а корректнее будет ниже
                // [`tag_type_${tag}`]: true
                ['tag_type_new']: tag === 'new',
                ['tag_type_sale']: tag === 'sale',
                })}>{tag}</span>)}
        </div>
        <div className='card__sticky card__sticky_type_top-right'>
            <button className={cn ('card__favorite', {
                // первый аргумент обязательный, а далее в {} условие: если isLiked будет тру, то класс применяй 
                'card__favorite_is-active': liked
            })} onClick={handleLikeClick}>
            <Save className='card__favorite-icon'/>
            </button>
        </div>
        {/* чтобы все было кликабельно завернули в тег а */}
        <a href="#" className='card__link'>
        <img src={pictures} className='card__image' alt={description}/>
            <div className='card__desc'>
                {/* &nbsp; - неразры́вный пробе́л, говорит что то что справа от него (₽) и то что слева от него не должны быть разделимо, между ними не должно быть переноса, на др. строку переносятся вместе// Условие, если скидка не равна нулю, то добавляем класс (красная цена товара), а если нет, то добавляем класс, где цена товара черная */}
                <span className={discount !== 0 ? 'card__old-price' : 'card__price'}>{price}&nbsp;₽</span>

                {/* условный рендеринг/ проверяем, что есть скидка и отображаем посчитанную цену со скидкой */}
               {discount !== 0 && <span className='card__price card__price_type_discount'>{discountPrice}&nbsp;₽</span>}
                <span className='card__wight'>{wight}</span>
                <p className='card__name'>{name}</p>
            </div>
        </a>
        <a href="#" className='card__cart btn btn_type_primary'>В корзину</a>

      </div>
  );
};

export default Card;
