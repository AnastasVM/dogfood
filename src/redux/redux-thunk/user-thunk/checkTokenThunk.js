import { createAsyncThunk } from "@reduxjs/toolkit";

// первый аргумент - префект(typePrefix, чтобы понимал в какой слайс нужно идти (name: 'user')), а второй (payloadCreator) - это ф-ция у кот первый аргумент name(можно поставить просто _) а второй объект с реструкторизацией
export const checkTokenThunk = createAsyncThunk(
    'user/checkTokenThunk', 
    // с помощью ф-ции getState ф-ция позволяющая выполняя асинхронный запрос сразу получить внутри него доступ к стейту текущему/ rejectWithValue - если промис был неудачным, а если удачно то fulfillWithValue/помогают структурировать данные кот. помогают работе в слайсе
    async function(dataAuth, {rejectWithValue, fulfillWithValue, dispatch, getState, extra: api}) {
        // в корневом файле стора сделаем настройку, чтобы это поле extra (это кастомная настройка мидлвара) перемеименовали на api более нам привычно
        try {
            const data = await api.checkToken(dataAuth);
        return fulfillWithValue(data);
        } catch (e) {
            // если наш рефреш токен не обновился, протухли то в локалсторож токен удаляем
            localStorage.removeItem('jwt');
            return rejectWithValue(e);
        }
})