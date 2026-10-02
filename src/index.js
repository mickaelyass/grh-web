import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

// Bootstrap must be loaded BEFORE the GestiPerso/CoreUI theme so that the
// application design system always wins the cascade (same class names).
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

