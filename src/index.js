import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // подключаем наш store из пакета реакт-редакс, оборачивая весь проект в провайдер => у нас появляется доступ внутри нашего приложения к хукам из пакета react-redux (юсСелектор(чтобы обратится к стору и взять данные) и useDispatch(для активации какого-то экщена))
    <Provider store={store}>
        {/* для гитхаба меняем роут BrowserRouter на HashRouter, но он добавляет #, поэтому локально работем на BrowserRouter, потом при заливке на гитхаб нужно поменять */}
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
);
