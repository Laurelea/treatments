import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('react-dom/client')
const { createRoot } =  client

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

 reportWebVitals();
