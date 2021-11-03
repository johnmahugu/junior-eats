import React from 'react'
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from 'react-router-dom'

import AppView from './AppView'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppView />
      </Router>
    </Provider>
  )
}

export default App
