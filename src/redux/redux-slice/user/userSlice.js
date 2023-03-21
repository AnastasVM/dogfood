import { createSlice } from "@reduxjs/toolkit";
import { getUserInfoThunk } from "../../redux-thunk/user-thunk/getUserInfoThunk";
import { isError } from "../../../utils/utilStore";

// первоначальное состояние нашего стора
const initialState = {
    userInfo: {},
    // загрузка
    isLoading: false,
    errors: null
}

// это ф-ция из пакету рект-тулкит
const userSlice = createSlice({
    // нейм слайса, очень важно - это типа экшен/именно по данному имени подставили в typePrefix в getAllProductsThunk
    name: 'user',
    initialState,
    // обычный редьюсер работает с изменением текущего стора(синхронный)
    reducers:{},
    // редьюсеры для ассинхронной работы/ builder - это объект у которого есть ф-ция addCase, куда мы добавляем один срез работы со стором и туда нам нужно опрокинуть ассинхронный запросс
    extraReducers: (builder) => {
        // функция принимает первый аргумент сам промис, указали состояние уже выполненого промиса(fulfilled), а второй это колбек - это наш редьюсер в котором два аргумента (стейт и акшен)/если кейс выполнится, то редьюсер будет проводить следующую операцию
        builder.addCase(getUserInfoThunk.fulfilled, (state, action) => {
            // console.log('redux-user', action.payload);
            state.userInfo = action.payload;
            state.isLoading = false;
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(getUserInfoThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })
       
        // любой промис если упал, зашел сюда, ошибку забрал и записал, в стейте всегда это будет видно/ первый аргумент ф-ция из products.js, второй - наш редьюсер/будет работать для всех санков, нет дублирования кода
        builder.addMatcher(isError, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        })
    }

});

export default userSlice.reducer;