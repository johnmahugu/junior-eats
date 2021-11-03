import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { SignUpView, LoginView } from '../onboarding'
import { AdminView } from '../admin'
import { HomePage } from '../web'

import getToken from '../onboarding/getToken'
import './styles.css'

function AppView() {
  const auth = useSelector(state => state.auth)
  const isAuthenticated = getToken()

  // alert(isAuthenticated)

  // if (isAuthenticated) {
  //   return (<Redirect to="/admin/users" />)
  // }
  
  if (isAuthenticated) {
    return (
      <AdminView />
    )
  }

  return (
    <div className="App">
        <Switch>
          <Route path="/login">
              <LoginView />
          </Route>
          <Route path="/register">
              <SignUpView />
          </Route>
          <Route path="/logout">
              <SignUpView />
          </Route>
          <Route path="/">
              <HomePage />
          </Route>
        </Switch>
    </div>
  )
}

export default AppView;
