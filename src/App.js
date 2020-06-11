import React, { useReducer, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { CookiesProvider, useCookies } from 'react-cookie'
import { getInitialState } from './state/initial'
import { reducer } from './state/reducer'
import ConnectSocket from './components/ConnectSocket'
import Connect from './components/ConnectForm'
import ConditionalRoute from './components/ConditionalRoute'
import { GET_COOKIES } from './actions/types'

export const CncContext = React.createContext()

const NoMatch = ({ location }) => (
  <div>
    <h3><code>{location.pathname}</code> not found!</h3>
  </div>
)

function App() {
  const [cookies, setCookie] = useCookies(['cnc'])
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const { port, controller, baudrate } = state

  useEffect(() => {
    if (cookies.cnc) {
      dispatch({ type: GET_COOKIES, payload: cookies.cnc })
    }
  }, [cookies])

  useEffect(() => {
    if (port) {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      setCookie('cnc', {
        controllerType: controller.type,
        port: port,
        baudrate: baudrate
      }, { path: '/', expires: date })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port])

  return (
    <Container>
      <CookiesProvider>
        <CncContext.Provider value={{ state: state, dispatch: dispatch }}>
          <Router>
            <ConnectSocket token={state.token} host={state.host} dispatch={dispatch} >
              <Switch>
                <Route path="/connect">
                  <Connect state={state}/>
                </Route>
                <ConditionalRoute path="/" connected={!!state.port}/>
                <Route component={NoMatch} />
              </Switch>
            </ConnectSocket>
          </Router>
        </CncContext.Provider>
      </CookiesProvider>
    </Container>
  )
}

export default App
