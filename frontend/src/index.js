import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './bootstrap-override.scss';
import reportWebVitals from './reportWebVitals';
import './i18n';
import AuthenticationContext from './shared/AuthenticationContext';

import App from './container/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<div>
      <AuthenticationContext>
         <App/>   
      </AuthenticationContext>
       
  
</div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
