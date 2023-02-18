// функция обрабатывающая положительный либо отрицательный ответ с сервера
const onResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}


class Api {
    constructor({baseUrl, headers}) {
        this._headers = headers;
        this._baseUrl = baseUrl;
    }

    // получение всех продуктов
    getProductList() {
        return fetch(`${this._baseUrl}/products`, {
            headers: this._headers,
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

    // получить данные пользователя
    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers,
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

    // изменить данные пользователя
    setUserInfo(dataUser) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(dataUser),
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

    // поиск по товарам/будем передавать в нее квери параметр (строка которую мы будем печатать в поиске) и этот квери параметр и будет отправляться в запрос на сервер, чтобы отфильтровать данные которые будут показываться
    search(searchQuary) {
        return fetch(`${this._baseUrl}/products/search?query=${searchQuary}`, {
            headers: this._headers,
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

    // лайки
    changeLikeProduct(productId, isLike) {
        return fetch(`${this._baseUrl}/products/likes/${productId}`, {
            // передаем булевую переменную isLike по которой будем смотреть, если она trye, т.е. она лайкнута то метод Delete (удаляем), а если лайк не стоит и функция эта вызывается, то надо лайк поставить
            method: isLike ? 'DELETE' : 'PUT',
            headers: this._headers,
        }).then(onResponse)
    }
}

const config = {
    baseUrl: 'https://api.react-learning.ru',
    headers: {
        'Content-Type': 'application/json',
        // токен из пастмона
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VjYWI5YzU5Yjk4YjAzOGY3N2I2MzMiLCJncm91cCI6IkROIiwiaWF0IjoxNjc2NDU1MTUzLCJleHAiOjE3MDc5OTExNTN9.pu4CMYxcJ-4Fw9IpvBe2bLGIS8I5phf6C_BkbVmhrNk'
    }
}

const api = new Api(config);

export default api;