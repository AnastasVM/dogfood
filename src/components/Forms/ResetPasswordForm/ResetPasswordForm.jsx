import React from "react";
import {useForm} from "react-hook-form";
import s from "../RegistrationForm/RegistrationForm.module.css";
import InputText from "../../InputText/InputText";
import Button from "../../Button/Button";

const ResetPasswordForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: 'onBlur'});

    const onSubmit = (data) => {
        console.log('data-->', data);

    }

    const emailRegister = register('email', {
        required: 'Обязательное поле',
        pattern: {
            value: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
            message: 'Не валидный email'
        }
    });

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={s.title}>Восстановление пароля</h3>
            <p className={s.description}>Для получения временного пароля необходимо ввести email, указанный при
                регистрации.</p>
            <InputText
                {...emailRegister}
                placeholder="Ваш email"
                errorText={errors.email?.message}
            />
            <p className={s.description}>Срок действия временного пароля 24 ч.</p>
            <Button>Отравить</Button>
        </form>
    );
   
};

export default ResetPasswordForm;