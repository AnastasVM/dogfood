// функция обрабатывающая положительный либо отрицательный ответ с сервера
const onResponse = (res) => {
    return res.ok ? res.json() : res.json().then(err => Promise.reject(err));
}


class Api {
    constructor({baseUrl, headers}) {
        this._headers = headers;
        this._baseUrl = baseUrl;
    }

    // получение всех продуктов
    getProductList(token) {
        return fetch(`${this._baseUrl}/products`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
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

    // получение продукта по id
    getProductById(idProduct, token) {
        return fetch(`${this._baseUrl}/products/${idProduct}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
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
    search(searchQuary, token) {
        return fetch(`${this._baseUrl}/products/search?query=${searchQuary}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

    // лайки
    changeLikeProduct(productId, isLike, token) {
        return fetch(`${this._baseUrl}/products/likes/${productId}`, {
            // передаем булевую переменную isLike по которой будем смотреть, если она trye, т.е. она лайкнута то метод Delete (удаляем), а если лайк не стоит и функция эта вызывается, то надо лайк поставить
            method: isLike ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(onResponse)
    }

    // регистрация
    register(dataUser) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(dataUser),
        }).then(onResponse)
    }

    login(dataUser) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(dataUser),
        }).then(onResponse)
    }

    // проверка JWT токена, делаем правильный фронт под некорректный бек/передаем токен из нашего хранилища и отправлять его в авторизацию, проверяем (на бэке у нас не хватает отдельного инпоинта для рефреш токена чтобы мы рефрешели его и не хватает логаута)
    checkToken(token) {
        return fetch(`${this._baseUrl}/users/me`, { 
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
            // then возвращает res (респонс) запроса
        }).then(onResponse)
    }

}

const config = {
    baseUrl: 'https://api.react-learning.ru',
    headers: {
        'Content-Type': 'application/json',
        // токен из постмана
        // Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VjYWI5YzU5Yjk4YjAzOGY3N2I2MzMiLCJncm91cCI6IkROIiwiaWF0IjoxNjc2NDU1MTUzLCJleHAiOjE3MDc5OTExNTN9.pu4CMYxcJ-4Fw9IpvBe2bLGIS8I5phf6C_BkbVmhrNk'
        // Authorization: `Bearer ${token}`
    }
}

const api = new Api(config);

export default api;