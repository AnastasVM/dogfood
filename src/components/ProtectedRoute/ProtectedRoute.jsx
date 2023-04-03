// HOC - функция высшего порядка, принимает компонент и возвращает компонент/ приверяет имеет ли юзер право открыть ту или иную страницу

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// isOnlyAuth - если пользователь уже авторизован
const ProtectedRoute = ({children, isOnlyAuth}) => {
    const { isAuth } = useSelector(state => state.user);
    const location = useLocation();

    // если пользователь уже авторизован и зарегистрирован, то если локейшен стейт есть, то дастанем из него from - куда и туда отправим пользователя, а если локейшена нет, то отправляем его на главную страницу  
    if (isOnlyAuth && isAuth) {
        const { from } = location.state || { from: { pathname: '/'}}

        return <Navigate to={ from } />
    }

    // если пользователь не авторизован и не залогинен то отправляем его на страницу авторизации (логин), но в стейт кладем текущий локейшен, там где мы находимся, это важно, т.к. после регистрации пользователь по записанному стейту попадает на нужную страницу (туда куда он хотел пойти)
    if (!isOnlyAuth && !isAuth) {
        return <Navigate to={{ pathname: '/login' }} state={{ from: location }} />
    }

    return (
                <>{children}</>
    );
};

export default ProtectedRoute;