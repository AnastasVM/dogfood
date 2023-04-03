import React, {forwardRef} from "react";
import s from './InputText.module.css';
import cn from "classnames";

// для корректной работы с ref весь функциональный компонент нужно обернуть в функцию forwardRef() - это ф-ция внутри пакета самого реакта, колбек, кот. в него передаем не должен быть с объектом, поэтому пробрасываем пропсы, а уже дальше их деструкторизируем
const InputText = forwardRef((props, ref) => {
    const {type = 'text', errorText, placeholder, ...restProps} = props;
    console.log('ref', ref);
    console.log('errorText', errorText);
    let input = null;
    if (type === 'text') {
        input = (
            <input className={cn(s.input, {
                // усли errorText есть, значит окрашиваем в красный цвет ошибки
                [s.inputError]: errorText,
            })} ref={ref} placeholder={placeholder} {...restProps} /> 
        )
    } else if (type === 'textarea') {
        input = <textarea className={cn(s.input, s.textarea, {
            [s.inputError]: errorText,
        })} placeholder={placeholder} {...restProps} />
    } else if (type === 'password') {
        input = <input type="password" className={cn(s.input, {
            [s.inputError]: errorText,
        })} placeholder={placeholder} {...restProps} />
    }
    
    return (
       <div>
            {input}
            {errorText ? (
                <div className={s.errorMessage}>{errorText}</div>
            ) : null}
       </div>
    );
});

export default InputText;