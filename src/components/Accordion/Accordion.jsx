import React, { useState } from "react";
import s from "./Accordion.module.css";
import cn from "classnames";

const Accordion = ({children, title}) => {
    const [isActive, setIsActive] = useState(false);

    const handleToggleAccordion = () => {
        setIsActive(!isActive);
    }

    return (
        <div className={cn(s.accordion, {
            [s.active] : isActive,
        })}>
            {/* весь заголовок сделали кнопкой, чтобы по клику открывался див ниже */}
            <button className={s.accordionButton} onClick={handleToggleAccordion}>
                <p className={s.title}>{title}</p>
            </button>
            {/* див, который раскроется */}
            <div className={s.content}>
                <p className={s.text}>{children}</p>
            </div>
        </div>
    )
};

export default Accordion;