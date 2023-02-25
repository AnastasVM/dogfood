 // нужно в массиве likes (id пользователей кот. лайкнули этот товар) искать id, если она существует, то лайк надо поставить, если ее нет, то не ставим/ методом some (проверяет удовлетворяет ли какой-либо элем. массива условию(берем id и проверяем если она равна id текущего пользователя, то вернем тру), заданному в передаваемой ф-ции и возвращает тру/фолс)
export const isLiked = (likes, userId) => likes?.some(id => id === userId); 

// считаем прайс со скидкой/ округляем до ближайшего целого числа
export const calcDiscountPrice = (price, discount) => {
    return Math.round(price - price * discount / 100);
};

// убираем разметку из текста, переданного из сети
export const createMarkup = (textHtml) => {
    return {__html: textHtml}
};