// кастомный хук
// нужно сделать задержку при поиске карточек, чтобы не было запросов на сервер при вводе каждой буквы поиска
// useState - хранит велью, useEffect - ставить тайм аут и его чистит
import { useState, useEffect } from "react";

// принимает велью(строка, кот вводим) и задержку (delay), кот. делаем для отправки запроса на сервер
const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        // таймаут записали в переменную, чтобы потом очищать именно этот таймаут
        const timeout = setTimeout(() => {
            setDebounceValue(value);
        }, delay)

        // монтируем компонент внутри тела юзэффекта, а размонтируем в ретерне/ чистим наш таймаут
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounceValue;
}

export default useDebounce;