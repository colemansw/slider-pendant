import React, { Fragment } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowCircleUp,
  faArrowCircleDown
} from '@fortawesome/free-solid-svg-icons'
import ControlButton from './ControlButton'

const mapButtonRow = (buttonRow, sendMove, index, isDisabled) => (
  buttonRow.map((c, j) => (
    <Col className="text-center" key={`k${index},${j}`}>
      <div className="mx-1" >
        <ControlButton title={c.title} handleClick={(e) => sendMove(c.commands, e)} isDisabled={isDisabled}>
          {c.component}
        </ControlButton>
      </div>
    </Col>
  ))
)

const mapButtons = (buttonArray, sendMove, isDisabled) => (
  buttonArray.map((row, index) => (
    <Row className="mb-2" noGutters key={`r${index}`} aria-label="Control pad">
      {mapButtonRow(row, sendMove, index, isDisabled)}
    </Row>
  ))
)

const ControlPad = ({ step, handleChange, sendMove, isDisabled }) => {
  const topButtons = [// 6x2 array of button objects
    [
      { title: 'Move X- Y+', commands: 'X-Y+', component: <FontAwesomeIcon icon={faArrowCircleUp} transform="rotate--45" /> },
      { title: 'Move Y+', commands: 'Y+', component: 'Y+' },
      { title: 'Move X+ Y+', commands: 'X+Y+', component: <FontAwesomeIcon icon={faArrowCircleUp} transform="rotate-45" /> },
      { title: 'G28', commands: 'G28', component: 'G28' },
      { title: 'G30', commands: 'G30', component: 'G30' },
      { title: 'Move Z+', commands: 'Z+', component: 'Z+' }
    ],
    [
      { title: 'Move X-', commands: 'X-', component: 'X-' },
      { title: 'Move to zero (G0 X0 Y0 Z)', commands: 'X0Y0Z0', component: 'O ' },
      { title: 'Move X+', commands: 'X+', component: 'X+' },
      { title: 'Move to X zero (G0 X0)', commands: 'X0', component: 'X0' },
      { title: 'Move to Y zero (G0 Y0)', commands: 'Y0', component: 'Y0' },
      { title: 'Move to Z zero (G0 Z0)', commands: 'Z0', component: 'Z0' }
    ]
  ]
  const btmButtons = [
    { title: 'Move X- Y-', commands: 'X-Y-', component: <FontAwesomeIcon icon={faArrowCircleDown} transform="rotate-45" /> },
    { title: 'Move Y-', commands: 'Y-', component: 'Y-' },
    { title: 'Move X+ Y-', commands: 'X+Y-', component: <FontAwesomeIcon icon={faArrowCircleDown} transform="rotate--45" /> }
  ]

  const steps = [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100, 500]
  return (
    <Fragment>
      {mapButtons(topButtons, sendMove, isDisabled)}
      <Row className="mb-2" noGutters aria-label="Control pad">
        {mapButtonRow(btmButtons, sendMove, 2, isDisabled)}
        <Col xs={4}>
          <div className="mx-1">
            <select className="form-control" style={{ borderColor: 'black' }} onChange={handleChange} value={step}>
              {steps.map((v, i) => {
                return (
                  <option key={i.toString()} value={v}>{v}</option>
                )
              })}
            </select>
          </div>
        </Col>
        <Col xs={2}>
          <div className="mx-1">
            <ControlButton title={'Move Z-'} handleClick={(e) => sendMove('Z-', e)} >
              {'Z-'}
            </ControlButton>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ControlPad