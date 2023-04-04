import React from "react";
import { useNavigate } from "react-router-dom";
import s from './ContentHeader.module.css';
import { ReactComponent as Arrow} from './img/leftArrow.svg';

const ContentHeader = ({title, children}) => {
    const navigate = useNavigate();
    return (
    <div className="container__inner">
       <a className={s.buttonBack} onClick={() => navigate(-1)}>
        <Arrow/>Назад</a>
       <h1 className={s.title}>{title}</h1>
       {children}
    </div>
    );
};

export default ContentHeader;