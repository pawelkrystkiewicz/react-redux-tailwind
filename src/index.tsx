import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
import allReducers from './store/reducers'

const store = createStore(allReducers)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

reportWebVitals(console.log)
