import {
  STEP_CHANGE,
  GET_COOKIES,
  SET_TOKEN,
  SET_CONTROLLER,
  ADD_POSITION,
  RESET_POSITION,
  REMOVE_POSITION,
  SET_TRANSITION,
  REMOVE_TRANSITION,
  ADD_TRANSITION,
  SET_MODAL,
  SET_CURRENT_INDEX,
  SET_CURRENT_TRANSITION,
  SET_UNITS,
  SET_MACHINE_POSITION,
  SET_WORK_POSITION,
  SET_ACTIVE_STATE,
  RESET_STATE,
  SET_CONTROLLER_SETTINGS,
  SET_PORT,
  SET_PORTS,
  SET_CONTROLLER_CONNECTED,
  SET_HOST
} from '../actions/types'

export const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_HOST:
      return {
        ...state,
        host: payload || state.host
      }
    case SET_CONTROLLER_CONNECTED:
      return {
        ...state,
        controller: {
          ...state.controller,
          connected: payload
        }
      }
    case SET_PORTS:
      return {
        ...state,
        ports: payload
      }
    case SET_PORT:
      return {
        ...state,
        port: payload
      }
    case SET_CONTROLLER_SETTINGS:
      return {
        ...state,
        controller: {
          ...state.controller,
          type: payload.type,
          settings: payload.settings
        }
      }
    case RESET_STATE:
      return payload
    case SET_MACHINE_POSITION:
      return {
        ...state,
        machinePosition: payload
      }
    case SET_WORK_POSITION:
      return {
        ...state,
        workPosition: payload
      }
    case SET_ACTIVE_STATE:
      return {
        ...state,
        activeState: payload
      }
    case SET_UNITS:
      return {
        ...state,
        units: payload || state.units
      }
    case SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: payload
      }
    case SET_CURRENT_TRANSITION:
      return {
        ...state,
        currentTransition: payload
      }
    case SET_MODAL:
      return {
        ...state,
        showModal: payload
      }
    case RESET_POSITION: 
      return {
        ...state,
        positions: [
        ...state.positions.slice(0, payload),
        state.machinePosition,
        ...state.positions.slice(payload  + 1)
      ]
    }
    case REMOVE_TRANSITION:
      return {
        ...state,
        transitions: [
          ...state.transitions.slice(0, payload),
          ...state.transitions.slice(payload + 1)
        ]
      }
    case REMOVE_POSITION:
      return {
        ...state,
        positions: [
        ...state.positions.slice(0, payload),
        ...state.positions.slice(payload + 1)
      ]
    }
    case ADD_TRANSITION: {
      return {
        ...state,
        transitions: [...state.transitions, payload]
      }
    }
    case SET_TRANSITION:{
      const { index, ...data } = payload
      return {
        ...state,
        transitions: [
          ...state.transitions.slice(0, index),
          data,
          ...state.transitions.slice(index + 1)
        ]
      }
    }
    case ADD_POSITION:
      return {
        ...state,
        positions: [...state.positions, payload]
      }
    case GET_COOKIES:
      return {
        ...state,
        controllerType: payload.controllerType || 'Gbrl',
        port: payload.port || '',
        baudrate: payload.baudrate || '115200'
      } 
    case STEP_CHANGE:
      return {
        ...state,
        step: payload
      }
    case SET_TOKEN:
      const token = payload || null
      if (!token) {
        try {
          let cnc = JSON.parse(localStorage.getItem('cnc') || {})
          cnc.state = cnc.state || {}
          cnc.state.session = cnc.state.session || {}
          return {
            ...state,
            token: cnc.state.session.token || ''
          }
        } catch (err) {
          return state
        }
      }
      return {
        ...state,
        token: token
      }
    case SET_CONTROLLER:
      return {
        ...state,
        controller: payload
      }
    default:
      return state
  }
}