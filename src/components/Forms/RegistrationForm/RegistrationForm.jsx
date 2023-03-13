import React, { useState } from "react";
import s from './RegistrationForm.module.css';
import { useForm } from "react-hook-form";
import Button from '../../Button/Button';
import InputText from "../../InputText/InputText";

// чтобы поднять данные выше, форма принимает addContact
const RegistrationForm = ({addContact, linkState}) => { 
// onBlur - проверка при нажатии пользователя вне поля ввода/по умолчанию стоит onChange
const { register, handleSubmit, formState: {errors}} = useForm({mode: 'onBlur'});

// ф-ция для обработки и отправки формы, получения входных данных, передаем ее в форму 
const onSubmit = (data) => {
    console.log('data--->', data);
}

const emailRegister = register('email', {
    required: 'Обязательное поле',
    pattern: {
        value: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        message: "Не валидный email"
    }
});

const passwordRegister = register('email', {
    required: 'Обязательное поле',
    pattern: {
        value: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        message: "Не валидный email"
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
                errorText={errors.password?.message}
            />
             <p className={s.description}>Регистрируясь на сайте, вы соглашаетесь с нашими Правилами и Политикой конфиденциальности и соглашаетесь на информационную рассылку.</p>

            <Button>Зарегистрироваться</Button>
            <Button href="/login" linkState={linkState} look="secondary" type="button">Войти</Button>
        </form>
    );
};

export default RegistrationForm;