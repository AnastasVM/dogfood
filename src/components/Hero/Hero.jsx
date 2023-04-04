// главные файлы в проекте обычно называют Hero
import React from "react";
import s from "./Hero.module.scss";
import cn from "classnames";
import { Link } from "react-router-dom";
import arrow from "./img/arrow.svg";
import banner from "./img/banner.png";

const Hero = () => {
    return (
    <div className={s.banner}>
        <div className={cn('container', s.bannerContainer)}>
            <div className={s.left}>
                <h1 className={s.title}>Крафтовые лакомства для собак</h1>
                <p className={s.subtitle}>Всегда свежие лакомства ручной работы с доставкой по России и Миру</p>
                {/* кнопка через линк */}
                <Link to="catalog" className={s.link}>Каталог <img src={arrow} alt="стрелка"/></Link>
            </div>
            <div className={s.rigth}>
                <img src={banner} alt="Собака" />
            </div>
        </div>
    </div>
    );
};

export default Hero;