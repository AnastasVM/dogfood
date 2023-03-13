import s from './Button.module.css';
import cn from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({look = 'primary', children, onClick, href, className, linkState, ...restProps }) => {
    // если пришол href, то возьми Link
    if (href) {
        return (
            <Link to={href} className={cn(s.button, className, {
                // условие по которому класс будет применяться, если type кот. пришел равен "primary", то пусть будет он, а если secondary, то будет secondary
                [s.primary]: look === 'primary',
                [s.secondary]: look === 'secondary',
            })} state={linkState} {...restProps}>{children}</Link>
        )
    }

    return (
        // ко всем кнопкам применяем класс button
        <button className={cn(s.button, className, {
            [s.primary]: look === 'primary',
            [s.secondary]: look === 'secondary',
        })} onClick={onClick} {...restProps}>
            {children}
        </button>
    )
};

export default Button;
