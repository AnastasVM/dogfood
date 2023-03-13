import React, { useEffect, useState } from "react";
import s from './Modal.module.css';
import cn from 'classnames';
import { useLocation, useNavigate } from "react-router-dom";

const Modal = ({children}) => {

    const [active, setActive] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const initialPath = location.state?.initialPath;

    useEffect(() => {
        setActive(true);
    }, []);

    // нажали мимо окна модалки и она закрылась
    const handleClose = () => {
        setActive(false);
        // если initialPath есть, то его, а иначе -1
        navigate(initialPath ? initialPath : -1);
    }
    
    return (
        <div className={cn(s.modal, {
        [s.active]: active
        })} onClick={handleClose}>
            <div className={cn(s.modalContent, {
                [s.active]: active
        // stopPropagation() - предотвратить всплытие события onClick={handleClose} на вложенные элементы, т.к. при нажатии на модалку, она тоже закрывается
            })} onClick={event => event.stopPropagation()}>
                {/* чтобы модалка была универсальная, оборачиваем любой контент в див и он будет появляться в модальном окне */}
                {children}
            </div>
        </div>
    )
};

export default Modal;