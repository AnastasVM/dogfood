import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as StarIcon } from "./img/star.svg";
import cn from "classnames";
import s from "./Rating.module.scss";

// пропс isEditable - определяем по нему есть ли у пользователя право редактировать или нет (где-то для отображения, а где-то для отзывов)/создаем сам рейтинг на странице Product.jsx
const Rating = ({isEditable = false, rating, setRating}) => {
    // в инишелстейт передаем новый массив с 5 элементами (реакт-фрагментами), fill - заполни в скобках - чем заполни, в нашем случае пустыми реакт фрагментами, внутрь которых будем складывать звезды
    const [ratingArray, setRatingArray] = useState(new Array(5).fill(<></>));
    // функция конструктор рейтинга, будем далее ее использовать в юсэффекте, поэтому оборачиваем в юсколбек, чтобы не было лишних перерендеров/принимает текущий рейтинг
    const constructRating = useCallback((currentRating) => {
        // на каждой итерации будем внутрь пустого реакт фрагмента складывать звезду
        const updateRating = ratingArray.map((el, index) => {
            return (
                <StarIcon 
                    className={cn(s.star, {
                        // s.filled будет если индекс будет меньше текущего рейтинга/текущий рейтинг пришел, если индекс больше то будет применятся класс филд/ если придет параметр isEditable, то принимай соответствующий класс
                        [s.filled] : index < currentRating,
                        [s.isEditable]: isEditable
                    })}
                    // отслеживание движение мыши когда мы "зашли" на элемент/наводим - звезда будет окрашиваться
                    onMouseEnter={() => changeDisplay(index +1)}
                    // когда мы ушли с элемента/остается тот рейтинг, который был установлен
                    onMouseLeave={() => changeDisplay(rating)}
                    // когда кликнули по звезде, рейтинг устанавливаем
                    onClick ={() => changeRating(index+1)}
                />
            )
        })
        setRatingArray(updateRating);
    }, [rating, isEditable]);

    // функция, меняющая внешний вид рейтинга (при наведении мыши звезды окрашиваются)
    const changeDisplay = (rating) => {
        // если isEditable будет фолс сразу ретерн - ничего не будем делать, а если не фолс, то
        if (!isEditable) return;
        constructRating(rating);
    }

    const changeRating = (rating) => {
        // и если setRating не придет (будет андефайнд), если функция setRating пришла, то рейтинг в нее пробросим
        if (!isEditable || !setRating) return;
        setRating(rating);
    }

    // отслеживает все изменения и запускает в нужный момент колбек
    useEffect(() => {
        constructRating(rating);
    }, [rating, constructRating]);

    return (
        <div>
            {ratingArray.map((star, index) => <span key={index}>{star}</span>)}
        </div>
        );
};

export default Rating;