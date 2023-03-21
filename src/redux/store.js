import { configureStore} from '@reduxjs/toolkit';
import productsReducer from './redux-slice/products/productsSlice';
import api from "../utils/api";
import userReducer from './redux-slice/user/userSlice';
import singleProductReducer from './redux-slice/singleProduct/singleProductSlice';

const store = configureStore({
    reducer: {
        // подключаем наш продуктCлайс, переименовали его в продуктРедьюсер
        products: productsReducer,
        // подключили userSlice, переименовали его в userReducer
        user: userReducer,
        singleProduct: singleProductReducer
    },
    // настраиваем наш мидлвар (некая прослойка для работы с ассинхронным кодом), т.к. у нас отдельный класс api и его нет подкапотом
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: {
            extraArgument: api,
        }
    })
})

export default store;