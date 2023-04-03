export const SORTED = {
    LOW: 'low',
    CHEAP: 'cheap',
    SALE: 'sale',
    POPULAR: 'popular'
}
// выносим РВ в переменные, т.к. это можно будет использовать в нескольких местах далее и легко все поменять если надо
export const REGEXP_EMAIL = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
export const REGEXP_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const REGEXP_GROUP = /^group-[0-9]{1,3}/;

export const VALIDATE_MESSAGE = {
    requiredMessage: 'Обязательное поле',
    emailMessage: 'Не валидный email',
    passwordMessage: 'Пароль должен содержать минимум восемь символов, одну букву латинского алфавита и одну цифру',
    groupMassage: 'Группа должна быть в формате: group-10',
}