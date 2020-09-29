import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthProvider from './AuthProvider'
import App from './App';
import {BrowserRouter,Route,Redirect} from 'react-router-dom';
import Header from './Header/Header'
import Checkout from './Checkout/Checkout'
import Receipt from './Receipt/Receipt'
import Directory from './Directory/Directory'
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
          <Route exact path="/" component={Directory} />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/receipt" component={Receipt} />
          <Route path="/shopping/:category" component={App} />
          <Redirect to="/" />
        </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);