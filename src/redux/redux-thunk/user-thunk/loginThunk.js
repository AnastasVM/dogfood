import { createAsyncThunk } from "@reduxjs/toolkit";

// первый аргумент - префект(typePrefix, чтобы понимал в какой слайс нужно идти (name: 'user')), а второй (payloadCreator) - это ф-ция у кот первый аргумент name(можно поставить просто _) а второй объект с реструкторизацией
export const loginThunk = createAsyncThunk(
    'user/loginThunk', 
    // с помощью ф-ции getState ф-ция позволяющая выполняя асинхронный запрос сразу получить внутри него доступ к стейту текущему/ rejectWithValue - если промис был неудачным, а если удачно то fulfillWithValue/помогают структурировать данные кот. помогают работе в слайсе
    async function(dataAuth, {rejectWithValue, fulfillWithValue, dispatch, getState, extra: api}) {
        // в корневом файле стора сделаем настройку, чтобы это поле extra (это кастомная настройка мидлвара) перемеименовали на api более нам привычно
        try {
            //получили данные и пробросили их в удачный результат/данные, кот. приходят - это объект с двумя ключами (data и token) нам нужно забрать токен и уже дальше его записать в локалсторож
            const data = await api.login(dataAuth);
            // если в полученных данных есть токен, то записываем в локалстородже
            if(data.token) {
                localStorage.setItem('jwt', data.token)
            } else {
                return rejectWithValue(data); 
            }
        return fulfillWithValue(data);
        } catch (e) {
            return rejectWithValue(e);
        }
})