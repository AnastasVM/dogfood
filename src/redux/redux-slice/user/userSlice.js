import { createSlice } from "@reduxjs/toolkit";
import { getUserInfoThunk } from "../../redux-thunk/user-thunk/getUserInfoThunk";
import { isError } from "../../../utils/utilStore";
import { registrationThunk } from "../../redux-thunk/user-thunk/registrationThunk";
import { loginThunk } from "../../redux-thunk/user-thunk/loginThunk";
import { checkTokenThunk } from "../../redux-thunk/user-thunk/checkTokenThunk";

// первоначальное состояние нашего стора
const initialState = {
    // проверяем юзер залогинился или нет/будет ставить тру, когда будем рефрешить токен
    isAuth: false,
    userInfo: {},
    // флаг для понимания успешной регистрации
    isRegistrationSuccess: false,
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
    reducers:{
        // при нажатии на кнопку выйти возвращаем стор в перноначальное состояние (очищаем) и удаляем jwt токен из локалсторожа, переводим регистрацию в лож /далее чтобы пользоваться редьюсером его нужно экспортировать
        logout: (state) => {
            state.userInfo = {};
            state.isAuth = false;
            localStorage.removeItem('jwt');
        }
    },
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
        // после регистрации бэк возвращает нам пользователя, а должет присылать jwt токен, поэтому делаем флаг в isRegistrationSuccess, чтобы понимать, что регистрация прошла успешно
        builder.addCase(registrationThunk.fulfilled, (state, action) => {
            // action.payload - это объект, который присылает бэк/Метод Object. keys возвращает массив строковых элементов, соответствующих именам перечисляемых свойств, найденных непосредственно в самом объекте. 
            if (Object.keys(action.payload).length > 0) {
                state.isRegistrationSuccess = true;
                state.isLoading = false;
            }
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(registrationThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })
        // авторизация/в ответ получаем данные юзера и токен, токен далее храним в локал сторож и уже из него брать
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            // action.payload - это объект, который присылает бэк/Метод Object. keys возвращает массив строковых элементов, соответствующих именам перечисляемых свойств, найденных непосредственно в самом объекте. 
            if (Object.keys(action.payload).length > 0) {
            //данные пользователя (по ключу data) запишем в стейт пользователя
                state.userInfo = action.payload.data;
                state.isLoading = false;
                // если токен пришел то меняем флаг на рту
                if (action.payload.token) {
                    state.isAuth = true;
                }
            }
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(loginThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })
        // отдельного чекпоинта на checkTokenThunk у нас нет на бэкэнде (не приходят в ответ токен, кот. мы далее используем), мы имулируем его, нам приходит объект с данными пользователя. Поэтомы мы проверяем, если данные пользователя пришли, то эти данные мы положим в стейт юзера и поле isAuth переводим в тру
        builder.addCase(checkTokenThunk.fulfilled, (state, action) => {
            // action.payload - это объект пользователя, который присылает бэк (в реальных проектах бэк может просто вернуть, статус ОК)/Метод Object. keys возвращает массив строковых элементов, соответствующих именам перечисляемых свойств, найденных непосредственно в самом объекте. 
            if (Object.keys(action.payload).length > 0) {
                state.userInfo = action.payload;
                // если isAuth тру, то на него завязано отображение всех данных
                state.isAuth = true;
                state.isLoading = false;
            }
        })

        // когда у нас будет загрузка(pending) будем чистить ошибки и пока промис загружается будем показывать лоудер
        builder.addCase(checkTokenThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })
       
        // любой промис если упал, зашел сюда, ошибку забрал и записал, в стейте всегда это будет видно/ первый аргумент ф-ция из products.js, второй - наш редьюсер/будет работать для всех санков, нет дублирования кода
        builder.addMatcher(isError, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            // state.isAuth = false;
        })
    }

});

// експортируем редьюсер, кот. работет со стейтом
export const { logout } = userSlice.actions;

export default userSlice.reducer;