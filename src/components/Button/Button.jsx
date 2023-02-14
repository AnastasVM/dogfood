import s from './Button.module.css';
import cn from 'classnames';
import React from 'react';

const Button = ({type, children}) => {
    return (
        // ко всем кнопкам применяем класс button
        <button className={cn(s.button, {
            // условие по которому класс будет применяться, если type кот. пришел равен "primary", то пусть будет он, а если secondary, то будет secondary
            [s.primary]: type === 'primary',
            [s.secondary]: type === 'secondary'
        })}>
            {children}
        </button>
    )
};

export default Button;
