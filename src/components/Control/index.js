import React, { Fragment, useContext, useState, useEffect } from 'react'
import map from 'lodash/map'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Link } from 'react-router-dom'
import {
  faPause,
  faPlay,
  faSync,
  faUnlock,
  faTrash,
  faAngleDoubleDown
} from '@fortawesome/free-solid-svg-icons'
import { CncContext } from '../../App'
import ControlPad from './ControlPad'
import CommandButton from './CommandButton'
import DropdownMenu from './DropdownMenu'
import TransitionModal from './TransitionModal'
import {
  STEP_CHANGE,
  SET_CURRENT_INDEX,
  RESET_POSITION,
  REMOVE_POSITION,
  ADD_POSITION,
  SET_CURRENT_TRANSITION,
  SET_MODAL,
  REMOVE_TRANSITION
} from '../../actions/types'
import {
  controllerCommand
} from '../../lib/controller'
import Joysticks from '../VirtualJoysticks'
import gcodeBlob from '../../utils/gcode'
import './css/control.css'

export default function Control() {
  const { state, dispatch } = useContext(CncContext)
  const { step } = state
  const [motorsEnergized, setMotorsEnergized] = useState(true)

  // Components used by Control

  const Position = ({ label = null, position }) => {
    const { x, y, z } = position
    return (
      <Fragment>
        {label ? <Col xs className="pl-4 text-left">{label}</Col> : null}
        <Col xs className="pr-4 text-right">{x}</Col>
        <Col xs className="pr-4 text-right">{y}</Col>
        <Col xs className="pr-4 text-right">{z}</Col>
      </Fragment>
    )
  }

  const ActionButton = ({ title, icon, handleClick }) => (
    <Button variant="outline-dark" size="sm" title={title} onClick={handleClick}>
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
  
  const AxesHeading = ({ labels }) => (
    <Row className="my-2 text-center">
      {labels.map((p, i) => (
        <Col key={`kp_${i}`} xs><h4>{p}</h4></Col>
      ))}
    </Row>
  )
  
  const Status = ({ mpos, wpos, units }) => {
    return (
      <Fragment>
        <AxesHeading labels={['Axes', 'Pan(\u00b0)', 'Tilt(\u00b0)', `Track(${units})`]} />
        <Row className="mb-2">
          <Position label={'Machine:'} position={mpos} />
        </Row>
        <Row className="mb-2">
          <Position label={'Working:'} position={wpos} />
        </Row>
      </Fragment>
    )
  }

  const Actions = ({ getTitle, isLast, index, dispatch }) => {
    
    const removeButton = (isLast, index, dispatch) => ({
      icon: faTrash,
      title: 'Remove position',
      handleClick: () => {
        dispatch({ type: REMOVE_POSITION, payload: index })
        dispatch({ type: REMOVE_TRANSITION, payload: isLast ? index - 1 : index })
      }
    })

    const resetButton = (index, dispatch) => ({
      icon: faSync,
      title: 'Set to current position',
      handleClick: () => dispatch({ type: RESET_POSITION, payload: index })
    })

    const transitionButton = (getTitle, index, dispatch) => ({
      icon: faAngleDoubleDown,
      title: `Edit: ${getTitle(index)}`,
      handleClick: () => {
        dispatch({ type: SET_MODAL, payload: true })
        dispatch({ type: SET_CURRENT_INDEX, payload: index })
        dispatch({ type: SET_CURRENT_TRANSITION, payload: state.transitions[index] })
      }
    })
  
    const buttons = isLast ?
      [resetButton(index, dispatch), removeButton(isLast, index, dispatch)] :
      [resetButton(index, dispatch), transitionButton(getTitle, index, dispatch), removeButton(isLast, index, dispatch)]
  
    return (
      <Col xs>
        <ButtonGroup aria-label={`Actions for item ${index + 1}`}>
          {buttons.map((a, i) => (
            <ActionButton key={`bk_${i}`} variant="outline_dark" title={a.title} handleClick={a.handleClick} icon={a.icon} />
          ))}
        </ButtonGroup>
      </Col>
    )
  }

  // Functions used by Control

  const sendMove = (cmd, e) => {
    e.preventDefault()
    let target = e.target
    if (target.type !== 'button') {
      target.parentElement.blur()
    }
    target.blur()
    const jog = (params) => {
      params = params || {}
      const s = map(params, (value, letter) => {
        return `${letter}${value}`
      }).join(' ')
      controllerCommand('gcode', 'G91') // relative distance
      controllerCommand('gcode', `G0 ${s}`)
      controllerCommand('gcode', 'G90'); // absolute distance
    }
    const move = (params) => {
      params = params || {}
      const s = map(params, (value, letter) => {
        return `${letter}${value}`
      }).join(' ')
      controllerCommand('gcode', `G0 ${s}`);
    }
    const distance = step || 0

    const fn = {
      'G28': () => controllerCommand('gcode', 'G28'),
      'G30': () => controllerCommand('gcode', 'G30'),
      'X0Y0Z0': () => move({ X: 0, Y: 0, Z: 0 }),
      'X0': () => move({ X: 0 }),
      'Y0': () => move({ Y: 0 }),
      'Z0': () => move({ Z: 0 }),
      'X-Y+': () => jog({ X: -distance, Y: distance }),
      'X+Y+': () => jog({ X: distance, Y: distance }),
      'X-Y-': () => jog({ X: -distance, Y: -distance }),
      'X+Y-': () => jog({ X: distance, Y: -distance }),
      'X-': () => jog({ X: -distance }),
      'X+': () => jog({ X: distance }),
      'Y-': () => jog({ Y: -distance }),
      'Y+': () => jog({ Y: distance }),
      'Z-': () => jog({ Z: -distance }),
      'Z+': () => jog({ Z: distance })
    }[cmd]

    fn && fn()
  }

  const recordPosition = () => {
    if (state.positions.length !== 0) {
      // At least one position has already been set, so we need to
      // get the transition between the last one and the new position.
      // The transition form will be rendered when 'state.showModal' is true 
      dispatch({
        type: SET_CURRENT_TRANSITION,
        payload: { frames: '5', interval: '4.00', shutter: '0.00' }
      })
      dispatch({ type: SET_CURRENT_INDEX, payload: null })
      // Set 'state.showModal' to true
      dispatch({ type: SET_MODAL, payload: true })
    } else {
      // No positions set, so just begin the position array with the current position.
      dispatch({ type: ADD_POSITION, payload: state.machinePosition })
    }
  }

  const handleStepChange = e => {
    e.preventDefault()
    const { value } = e.target
    dispatch({ type: STEP_CHANGE, payload: value })
    e.target.blur()
  }

  function downloadBlob(blob) {
    const url = URL.createObjectURL(blob)
    const timestamp = new Date()
    const a = document.createElement('a')
    a.href = url 
    a.download = `shot_${timestamp.toISOString()}.gcode`
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url)
        a.removeEventListener('click', clickHandler)
      }, 150)
    }
    a.addEventListener('click', clickHandler, false)
    a.click()
    return a
  }

  const handleMake = e => {
    e.preventDefault()
    const { target } = e
    downloadBlob(gcodeBlob(state))
    // dispatch({type: ADD_BLOB, payload:URL.createObjectURL(blob)})
    target.blur()
  }

  const showTransition = index => {
    const { frames, interval, shutter } = state.transitions[index]
    return `Fr: ${frames}, In: ${interval}, Sh: ${shutter}`
  }

  useEffect(() => {
    controllerCommand('statusreport')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    switch (state.controller.type) {
      case 'Grbl':
        if (!motorsEnergized) {
          controllerCommand('gcode', '$SLP')
        } else {
          controllerCommand('reset')
          controllerCommand('unlock')
        }
        break
      default:
        controllerCommand(`energizeMotors:${motorsEnergized ? 'on' : 'off'}`)
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motorsEnergized])

  return (
    <Fragment>
      <h1 className="text-center">Control</h1>
      <Row noGutters className="text-center">
        <DropdownMenu />
        <Col xs={6}>
          <div className="mx-1">
            <div className="active-state">
              <span className="align-middle">{state.activeState ? state.activeState : null}</span>
            </div>
          </div>
        </Col>
        <Col xs={2}>
          <div className="mx-1">
            <Button variant="outline-dark" block onClick={() => controllerCommand('cyclestart')}>
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          </div>
        </Col>
        <Col xs={2}>
          <div className="mx-1">
            <Button variant="outline-dark" block onClick={() => controllerCommand('feedhold')}>
              <FontAwesomeIcon icon={faPause} />
            </Button>
          </div>
        </Col>
      </Row >
      <Status mpos={state.machinePosition} wpos={state.workPosition} units={state.units} />
      <ControlPad step={state.step} handleChange={handleStepChange} sendMove={sendMove} isDisabled={state.activeState !== 'Idle'} />
      <Row noGutters className="text-center">
        <CommandButton
          title={` ${motorsEnergized ? 'Dis' : 'En'}able motors`}
          handleClick={() => setMotorsEnergized(!motorsEnergized)}
          variant={'warning'}
          size={4}
        >
          <FontAwesomeIcon icon={faUnlock} size="xs" />
          {` ${motorsEnergized ? 'Dis' : 'En'}able motors`}
        </CommandButton>
        <CommandButton
          title={'G92 X0'}
          variant={'secondary'}
          handleClick={() => controllerCommand('gcode', 'G92X0')}
        >
          G92 X0
        </CommandButton>
        <CommandButton
          title={'G92 Y0'}
          variant={'secondary'}
          handleClick={() => controllerCommand('gcode', 'G92Y0')}
        >
          G92 Y0
        </CommandButton>
        <CommandButton
          title={'G92 Z0'}
          variant={'secondary'}
          handleClick={() => controllerCommand('gcode', 'G92Z0')}
        >
          G92 Z0
        </CommandButton>
        <Col xs={2} title={'Add'}>
          <div className="mx-1">
            <Button
              onClick={recordPosition}
              variant="success"
              block
            >
              <FontAwesomeIcon icon={faSync} size="xs" />
              {" Add"}
            </Button>
          </div>
        </Col>
      </Row>
      <Joysticks isDisabled={state.activeState !== 'Idle'}/>
      <Row className="mt-2 text-center">
        <Col xs={12}>
          <h3>Recorded positions</h3>
        </Col>
      </Row>
      <AxesHeading labels={['X', 'Y', 'Z', 'Actions']} />
      <ListGroup>
        {state.positions.map((p, i, a) => (
          <ListGroup.Item key={`pk_${i}`}>
            <Row>
              <Position position={p} index={i} />
              <Actions getTitle={showTransition} isLast={i === (a.length-1)} index={i} dispatch={dispatch} />
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {state.transitions.length > 0 ?
        <Row>
          <Col xs={12}>
            <Button onClick={handleMake}>
              Make G-Code
            </Button>
          </Col>
        </Row> :
        null
      }
      {state.showModal ?
        <TransitionModal
          state={state}
          dispatch={dispatch}
        /> :
      null}
    </Fragment >
  )
}

// export { Position }
