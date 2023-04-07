import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './bootstrap-override.scss';
import reportWebVitals from './reportWebVitals';
import './i18n';
// import AuthenticationContext from './shared/AuthenticationContext';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore} from 'redux'

import App from './container/App';


const loggedInState = {
  isLoggedIn: true,
  username: 'user1',
  displayName: 'display1',
  image: null,
  password: 'P4ssword'
};

const defaultState = {
  isLoggedIn: false,
  username: undefined,
  displayName: undefined,
  image: undefined,
  password: undefined
};

const reducer = (state = { ...defaultState }, action) => {
  if (action.type === 'logout-success') {
    return defaultState;
  }
  return state;
};

const store = createStore(reducer, loggedInState);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<div>
      <Provider store ={store} >
          <App/>   
      </Provider>
</div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
