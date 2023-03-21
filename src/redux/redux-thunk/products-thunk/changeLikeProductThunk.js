import { createAsyncThunk } from "@reduxjs/toolkit";
import { isLiked } from "../../../utils/products";

// первый аргумент - префект(typePrefix, чтобы понимал в какой слайс нужно идти (name: 'products')), а второй (payloadCreator) - это ф-ция у кот первый аргумент name(можно поставить просто _) а второй объект с реструкторизацией
export const changeLikeProductThunk = createAsyncThunk(
    'product/changeLikeProductThunk', 
    // с помощью ф-ции getState ф-ция позволяющая выполняя асинхронный запрос сразу получить внутри него доступ к стейту текущему/ rejectWithValue - если промис был неудачным, а если удачно то fulfillWithValue/помогают структурировать данные кот. помогают работе в слайсе
    async function(product, {rejectWithValue, fulfillWithValue, dispatch, getState, extra: api}) {
        // в корневом файле стора сделаем настройку, чтобы это поле extra (это кастомная настройка мидлвара) перемеименовали на api более нам привычно
        try {
            const { user: { userInfo } } = getState();
            const liked = isLiked(product.likes, userInfo._id);
            const data = await api.changeLikeProduct(product._id, liked);
        return fulfillWithValue({product: data, liked});
        } catch (e) {
            return rejectWithValue(e);
        }
})