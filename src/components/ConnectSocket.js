import React, { useEffect, useState, Fragment } from 'react'
import { useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import {
  SET_TOKEN,
  SET_CONTROLLER_CONNECTED,
  SET_PORT,
  RESET_STATE,
  SET_CONTROLLER_SETTINGS,
  SET_CONTROLLER,
  SET_UNITS,
  SET_MACHINE_POSITION,
  SET_WORK_POSITION,
  SET_ACTIVE_STATE,
  SET_HOST,
  SET_PORTS
} from '../actions/types'
import { GRBL, IMPERIAL_UNITS, METRIC_UNITS } from '../lib/constants'
import {
  controllerConnect,
  addControllerEvents,
  removeControllerEvents,
  controllerWriteln
} from '../lib/controller'
import { getInitialState } from '../state/initial'

const queryString = require('query-string')

function ConnectSocket({ token, host, dispatch, children }) {

  const DISCONNECTED = 0
  const CONNECTING = 1
  const CONNECTED = 2
  const ERROR = 3
  const TIMEOUT = 4

  const [connectionState, setConnectionState] = useState(DISCONNECTED)
  const [msg, setMsg] = useState('')
  let location = useLocation()

  const alertVariant = []

  alertVariant[DISCONNECTED] = 'secondary'
  alertVariant[CONNECTING] = 'warning'
  alertVariant[CONNECTED] = 'info'
  alertVariant[ERROR] = 'danger'
  alertVariant[TIMEOUT] = 'danger'

  const controllerEvents = {
    'connect': () => setConnectionState(CONNECTED),
    'connect_error': err => {
      setConnectionState(ERROR)
      setMsg(`An error has occurred: ${err}`)
    },
    'connect_timeout': t => {
      setConnectionState(TIMEOUT)
      setMsg(`Timeout: ${t}`)
    },
    'disconnect': () => setConnectionState(DISCONNECTED),
    'serialport:read': data => {
      const style = 'font-weight: bold; line-height: 20px; padding: 2px 4px; border: 1px solid; color: #222; background: #F5F5F5';
      console.log('%cR%c', style, '', data)
    },
    'serialport:write': data => {
      const style = 'font-weight: bold; line-height: 20px; padding: 2px 4px; border: 1px solid; color: #00529B; background: #BDE5F8';
      console.log('%cW%c', style, '', data);
    },
    'serialport:open': (options) => {
      const { port, controllerType } = options;
      dispatch({ type: SET_PORT, payload: port })
      if (controllerType === GRBL) {
        controllerWriteln('$$')
      }
    },
    'serialport:close': (options) => {
      dispatch({ type: RESET_STATE, payload: getInitialState() })
    },
    'controller:settings': (controllerType, controllerSettings) => {
      dispatch({
        type: SET_CONTROLLER_SETTINGS,
        payload: { type: controllerType, settings: controllerSettings }
      })
    },
    'controller:state': (controllerType, controllerState) => {
      dispatch({ type: SET_CONTROLLER, payload: { controllerType, controllerState } })
      if (controllerType === GRBL) {
        const {
          status: { activeState, mpos, wpos },
          parserstate: { modal = {} }
        } = controllerState
        const units = {
          'G20': IMPERIAL_UNITS,
          'G21': METRIC_UNITS
        }[modal.units]
        dispatch({ type: SET_UNITS, payload: units })
        dispatch({ type: SET_MACHINE_POSITION, payload: mpos })
        dispatch({ type: SET_WORK_POSITION, payload: wpos })
        dispatch({ type: SET_ACTIVE_STATE, payload: activeState })
      }
      // Add other controller types below...
    },
    'serialport:list': data => dispatch({ type: SET_PORTS, payload: data })
  }

  useEffect(() => {
    dispatch({ type: SET_CONTROLLER_CONNECTED, payload: connectionState === CONNECTED })
    setMsg(connectionState === CONNECTED ? 'Connected' : connectionState === DISCONNECTED ? 'Disconnected' : msg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState])

  useEffect(() => {
    addControllerEvents(controllerEvents)
    return () => {
      removeControllerEvents(controllerEvents)
    }
  }, [controllerEvents])

  useEffect(() => {
    const qs = queryString.parse(location.search)
    dispatch({ type: SET_TOKEN, payload: qs.token })
    dispatch({ type: SET_HOST, payload: qs.host })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => {
    if (token && connectionState === DISCONNECTED) {
      controllerConnect(host, token)
      setConnectionState(CONNECTING)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, connectionState])

  return (
    <Fragment>
      {connectionState !== CONNECTED ?
      <Alert variant={alertVariant[connectionState]}>
        {msg}
      </Alert>
      : null }
      {children}
    </Fragment>

  )
}

export default ConnectSocket
