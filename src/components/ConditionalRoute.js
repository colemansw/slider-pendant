import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Workspace from '../components/Workspace'
import Control from '../components/Control'

function ConditionalRoute({ connected, ...props }) {

  return (
    <Route
      {...props}
      render={({ location }) => connected ? (
        <Switch>
          <Route exact path="/workspace" >
            <Workspace />
          </Route>
          <Route exact path="/control" >
            <Control />
          </Route>
        </Switch>
      ) : (
          <Redirect
            to={{
              pathname: '/connect',
              state: { from: location }
            }}
          />
        )}
    />
  )
}

export default ConditionalRoute
