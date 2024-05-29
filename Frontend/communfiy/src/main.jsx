import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store,persistor } from './Redux/userStore.js'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <div className="bg-zinc-200 min-h-screen"> {/* Apply bg-zinc-200 to set the background color */}
        <App />
      </div>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
