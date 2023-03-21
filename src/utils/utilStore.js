// утилиты для стора
// ф-ция, которая будет выполнять код, если упал промис (запрос с сервера), чтобы не писать ошибку в каждом слайсе
export function isError(action) {
    return action.type.endsWith('rejected');
}