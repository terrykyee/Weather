import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WeatherInfo from './components/WeatherInfo/WeatherInfo';
import dotenv from 'dotenv';

dotenv.config();
const root = (
  <BrowserRouter>
    <div>
      <Route path='/' component={App} />
      <Route path='/city/:city' component={WeatherInfo} />
    </div>
  </BrowserRouter>
);

ReactDOM.render(root, document.getElementById('root'));
registerServiceWorker();
