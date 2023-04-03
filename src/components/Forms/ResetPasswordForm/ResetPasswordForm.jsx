import React from "react";
import {useForm} from "react-hook-form";
import s from "../RegistrationForm/RegistrationForm.module.css";
import InputText from "../../InputText/InputText";
import Button from "../../Button/Button";
import { REGEXP_EMAIL, VALIDATE_MESSAGE } from "../../../utils/constants";

const ResetPasswordForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: 'onBlur'});

    const onSubmit = (data) => {
        console.log('data-->', data);

    }

    const emailRegister = register('email', {
        required: VALIDATE_MESSAGE.requiredMessage,
        pattern: {
            value: REGEXP_EMAIL,
            message: VALIDATE_MESSAGE.emailMessage,
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