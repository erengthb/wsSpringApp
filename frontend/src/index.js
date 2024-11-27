import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './bootstrap-override.scss';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { Provider } from 'react-redux';
import App from './container/App';
import configureStore from './redux/configureStore';



const store = configureStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<div>
      <Provider store ={store} >
          <App/>   
      </Provider>
</div>
);

reportWebVitals();
