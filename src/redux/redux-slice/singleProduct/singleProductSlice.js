import { createSlice } from "@reduxjs/toolkit";
import { isError } from "../../../utils/utilStore";
import { getSingleProductThunk } from "../../redux-thunk/singleProduct-thunk/getSingleProductThunk";

// первоначальное состояние нашего стора
const initialState = {
    singleProduct: {},
    // загрузка
    isLoading: false,
    errors: null
}

const singleProductSlice = createSlice({
    // нейм слайса, очень важно - это типа экшен/именно по данному имени подставили в typePrefix в getAllProductsThunk
    name: 'singleProduct',
    initialState,
    // обычный редьюсер работает с изменением текущего/локального стора(синхронный)
    reducers:{
        setProductState: (state, action) => {
            state.singleProduct = action.payload;
        }
    },
    // редьюсеры для ассинхронной работы/ builder - это объект у которого есть ф-ция addCase, куда мы добавляем один срез работы со стором и туда нам нужно опрокинуть ассинхронный запросс
    extraReducers: (builder) => {
        // функция принимает первый аргумент сам промис, указали состояние уже выполненого промиса(fulfilled), а второй это колбек - это наш редьюсер в котором два аргумента (стейт и акшен)/если кейс выполнится, то редьюсер будет проводить следующую операцию
        builder.addCase(getSingleProductThunk.fulfilled, (state, action) => {
            state.singleProduct = action.payload;
            state.isLoading = false;
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(getSingleProductThunk.pending, state => {
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
// actions - это редьюсеры setProductState
export const {setProductState} = singleProductSlice.actions;
export default singleProductSlice.reducer;