import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
//Importohet BrowserRouter për të mundësuar navigimin midis faqeve me React Router.
ReactDOM.createRoot(document.getElementById('root')).render( //Renderon aplikacionin në browser.
//  Mbështjell aplikacionin për të aktivizuar React Router dhe routes.
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)