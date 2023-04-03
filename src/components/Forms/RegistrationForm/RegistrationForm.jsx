import React, { useState } from "react";
import s from './RegistrationForm.module.css';
import { useForm } from "react-hook-form";
import Button from '../../Button/Button';
import InputText from "../../InputText/InputText";
import { REGEXP_EMAIL, REGEXP_GROUP, REGEXP_PASSWORD, VALIDATE_MESSAGE } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { registrationThunk } from "../../../redux/redux-thunk/user-thunk/registrationThunk";


// чтобы поднять данные выше, форма принимает addContact
const RegistrationForm = ({addContact, linkState}) => { 
// onBlur - проверка при нажатии пользователя вне поля ввода/по умолчанию стоит onChange
const { register, handleSubmit, formState: {errors}} = useForm({mode: 'onBlur'});

// выводим сообщение об ошибке
const { error: errorRedux } = useSelector(state => state.user)
// вызываем санку в редаксе через хук
const dispatch = useDispatch();


// ф-ция для обработки и отправки формы, получения входных данных, кот. мы ввели в инпут (data) передаем в registrationThunk, пробрасывать этот инпоит и затем в юзерСлайсе обрабатывать
const onSubmit = (data) => {
    console.log('data--->', data);
    dispatch(registrationThunk(data));
}

const emailRegister = register('email', {
    required: VALIDATE_MESSAGE.requiredMessage,
    pattern: {
        value: REGEXP_EMAIL,
        message: VALIDATE_MESSAGE.emailMessage,
    }
});

const passwordRegister = register('password', {
    required: VALIDATE_MESSAGE.requiredMessage,
    pattern: {
        value: REGEXP_PASSWORD,
        message: VALIDATE_MESSAGE.passwordMessage,
    }
});

const groupRegister = register('group', {
    required: VALIDATE_MESSAGE.requiredMessage,
    pattern: {
        value: REGEXP_GROUP,
        message: VALIDATE_MESSAGE.groupMassage,
    }
});

    return (
        // handleSubmit - соберет данные из полей ввода и мы получим их в onSubmit в виде объекта data/ ф-ция handleSubmit высшего порядка, она возвращает другую функцию в результате не будет перезагрузки страницы и данные пользователя собираются
         <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={s.title}>Регистрация</h3>
            {/* рест оператор работает под капотом с реф и понимает какой именно инпут валидируется, с какого импута снять обработку */}
            <InputText 
                {...emailRegister} 
                placeholder="Ваш email" 
                errorText={errors.email?.message}
            />

            <InputText 
                {...passwordRegister} 
                placeholder="Ваш пароль"
                // чтобы пароль был скрыт, вместо цифр кружочки
                // type="password"
                errorText={errors.password?.message}
            />
            <InputText 
                {...groupRegister} 
                placeholder="Укажите вашу группу"
                errorText={errors.group?.message}
            />
             <p className={s.description}>Регистрируясь на сайте, вы соглашаетесь с нашими Правилами и Политикой конфиденциальности и соглашаетесь на информационную рассылку.</p>
            {/* если есть эта ошибка, то давай ее выведем */}
            {errorRedux ? (
                <p className={s.errorMessage}>{errorRedux.message}</p>
            ) : null}
            <Button>Зарегистрироваться</Button>
            <Button href="/login" linkState={linkState} look="secondary" type="button">Войти</Button>
        </form>
    );
};

export default RegistrationForm;