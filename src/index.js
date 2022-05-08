import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { library } from '@fortawesome/fontawesome-svg-core';
import { far,   } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare, faCoffee, faBars,
         faTimes, faMapMarkerAlt, faChevronLeft,
         faPhoneAlt, faEnvelope, faBell, faSearch, faPen,
         faComment, faSync, faHeart, faExclamationTriangle,
        faHeartBroken, faSadTear, faSmile, faCamera, faPlusCircle, faAngleRight
        
        } from '@fortawesome/free-solid-svg-icons';
import { Provider } from 'react-redux';
import store from './redux/store';


// import 'bootstrap/dist/css/bootstrap.css';

// import './styles/app.scss';

library.add( far, faCheckSquare, faCoffee, faBars, faTimes,
             faMapMarkerAlt, faChevronLeft, faPhoneAlt,
             faEnvelope, faBell, faSearch, faPen, faComment,
             faSync, faHeart, faExclamationTriangle, faHeartBroken, 
             faSmile, faSadTear, faCamera, faPlusCircle, faAngleRight
             );

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
