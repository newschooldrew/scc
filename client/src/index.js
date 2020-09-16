import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthProvider from './AuthProvider'
import App from './App';
import {BrowserRouter,Route} from 'react-router-dom';
import Header from './Header/Header'
import Checkout from './Checkout/Checkout'
import "./assets/css/bootstrap.min.css";
import "./assets/scss/now-ui-kit.scss";
import "./assets/scss/now-ui-dashboard.scss?v=1.4.0";
import "./assets/demo/demo.css";
import "./assets/demo/react-demo.css";
import "./assets/demo/nucleo-icons-page-styles.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Route exact path="/" component={App} />
        <Route exact path="/checkout" component={Checkout} />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);