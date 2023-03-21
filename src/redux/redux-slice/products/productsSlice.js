import { createSlice } from "@reduxjs/toolkit";
import { getAllProductsThunk } from "../../redux-thunk/products-thunk/getAllProductsThunk";
import { isError } from "../../../utils/utilStore";
import { isLiked } from "../../../utils/products";
import { changeLikeProductThunk } from "../../redux-thunk/products-thunk/changeLikeProductThunk";

// первоначальное состояние нашего стора
const initialState = {
    // массив продуктов
    products: [],
    // отдельное хранилище для избранного
    favourites: [],
    total: 0,
    // загрузка
    isLoading: false,
    errors: null
}

// это ф-ция из пакету рект-тулкит
const productsSlice = createSlice({
    // нейм слайса, очень важно - это типа экшен/именно по данному имени подставили в typePrefix в getAllProductsThunk
    name: 'products',
    initialState,
    // обычный редьюсер работает с изменением текущего стора(синхронный)
    reducers:{},
    // редьюсеры для ассинхронной работы/ builder - это объект у которого есть ф-ция addCase, куда мы добавляем один срез работы со стором и туда нам нужно опрокинуть ассинхронный запросс
    extraReducers: (builder) => {
        // функция принимает первый аргумент сам промис, указали состояние уже выполненого промиса(fulfilled), а второй это колбек - это наш редьюсер в котором два аргумента (стейт и акшен)/если кейс выполнится, то редьюсер будет проводить следующую операцию
        builder.addCase(getAllProductsThunk.fulfilled, (state, action) => {
            const {total, products, currentUser} = action.payload;
            // console.log('action payload', action.payload);
            state.products = products;
            state.favourites = products.filter(item => isLiked(item.likes, currentUser._id));
            state.total = total;
            state.isLoading = false;
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(getAllProductsThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })

        builder.addCase(changeLikeProductThunk.fulfilled, (state, action) => {
            const { product, liked } = action.payload;

            state.products = state.products.map((cardState) => {
                // если id получаемого продукта совпадает с id карточки в стейте, то возвращаем продукт, если нет - карточку стейта
                return cardState._id === product._id ? product : cardState;
            })

             // если карточка новая и она была не лайкнута, а ее лайкнули то ее нужно добавить в срез с избранными
             if (!liked) {
               state.favourites.push(product);
        } else {
            // а если новая карточка была лайкнута, то ее нужно удалить из массива, для этого используем фильтр (вернет новый массив всего, что вернет истину в скобках)
            state.favourites = state.favourites.filter(card => card._id !== product._id);
        }
        })

         //загрузка, чтобы лоудинг корректно работал
         builder.addCase(changeLikeProductThunk.pending, state => {
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

export default productsSlice.reducer;