import React from "react";
import s from "../RegistrationForm/RegistrationForm.module.css";
import cn from "classnames";
import Button from "../../Button/Button";
import { useForm } from "react-hook-form";
import InputText from "../../InputText/InputText";
import {Link} from "react-router-dom";

const LoginForm = ({linkState}) => {
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
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={s.title}>Вход</h3>

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

            <Link 
                to="/reset-password" 
                className={cn(s.description, s.resetPassword)}
                state={linkState}
            >Восстановить пароль</Link>
                
            <Button>Войти</Button>
            {/* будет роутинг на регистрацию */}
            <Button href="/registration" 
                linkState={linkState} 
                look="secondary" 
                type="button"
            >
            Регистрация
            </Button>
        </form>
    )
};

export default LoginForm;