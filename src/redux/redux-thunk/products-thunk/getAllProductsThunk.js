import { createAsyncThunk } from "@reduxjs/toolkit";

// первый аргумент - префект(typePrefix, чтобы понимал в какой слайс нужно идти (name: 'products')), а второй (payloadCreator) - это ф-ция у кот первый аргумент name(можно поставить просто _) а второй объект с реструкторизацией
export const getAllProductsThunk = createAsyncThunk(
    'products/getAllProductsThunk', 
    // с помощью ф-ции getState ф-ция позволяющая выполняя асинхронный запрос сразу получить внутри него доступ к стейту текущему/ rejectWithValue - если промис был неудачным, а если удачно то fulfillWithValue/помогают структурировать данные кот. помогают работе в слайсе
    async function(token, {rejectWithValue, fulfillWithValue, dispatch, getState, extra: api}) {
        // в корневом файле стора сделаем настройку, чтобы это поле extra (это кастомная настройка мидлвара) перемеименовали на api более нам привычно
        try {
            // при вызове ф-ции getStore получим стейт и из него заберем информацию о юзере
            const { user: { userInfo } } = getState();
            const data = await api.getProductList(token);
             // берем наш объект с данными (запрос на все продукты разворачиваем рест оператором и вторым полем добавить/передать информацию о юзере)
            return fulfillWithValue({...data, currentUser: userInfo});
        } catch (e) {
            return rejectWithValue(e);
        }
})