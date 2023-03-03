import React from "react";
import { useNavigate } from "react-router-dom";
import s from './ContentHeader.module.css';

const ContentHeader = ({title, children}) => {
    const navigate = useNavigate();
    return (
    <div>
       <a href="#" className={s.buttonBack} onClick={() => navigate(-1)}>Назад</a>
       <h1 className={s.title}>{title}</h1>
       {children}
    </div>
    );
};

export default ContentHeader;