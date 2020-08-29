import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import Joystick from './Joystick'
import { ActionButtons, LockButtons } from './JoystickButtons'
import { controllerCommand } from '../lib/controller'

const UPDATE_INTERVAL = 200 // ms
const MAXIMUM_SPEED = 10 // mm/s

// The joystick maximum is 50, so if we set the maximum speed
// to be 25mm/s that gives MAXIMUM_SPEED/max_range = 25/50 mm/s
const MAXSPEED = {
  x: MAXIMUM_SPEED / 50 * UPDATE_INTERVAL / 1000,
  y: MAXIMUM_SPEED / 50 * UPDATE_INTERVAL / 1000,
  z: MAXIMUM_SPEED / 50 * UPDATE_INTERVAL / 1000
} // mm per second

export default function Joysticks(props) {

  const { isDisabled } = props

  const [xRate, setXRate] = useState(0)
  const [yRate, setYRate] = useState(0)
  const [zRate, setZRate] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

  const [xySens, setXYSens] = useState(false)
  const [zSens, setZSens] = useState(false)

  const [xLock, setXLock] = useState(false)
  const [yLock, setYLock] = useState(false)


  const senseLabel = s => s ? 'High' : 'Normal'

  function jogCmd(cmds) {
    const { x = 0, y = 0, z = 0 } = cmds
    controllerCommand('gcode', 'G91')
    controllerCommand(
      'gcode',
      `G0 ${moveAxis('X', x, 0)}${moveAxis('Y', y, 0)}${moveAxis('Z', z, 0)}`
    )
    controllerCommand('gcode', 'G90')
  }

  const moveAxis = (axis, value, ignored) => {
    return value === ignored ? '' : ` ${axis}${value.toFixed(2)}`
  }

  const handleStart = () => {
    if (!isDisabled) setIsMoving(true)
  }

  const handleXYMove = (evt, data) => {
    if (isMoving) {
      const { distance, angle } = data
      setXRate(distance * Math.cos(angle.radian))
      setYRate(distance * Math.sin(angle.radian))
    }
  }

  const handleXYEnd = () => {
    setXRate(0)
    setYRate(0)
    setIsMoving(false)
  }

  const handleZMove = (evt, data) => {
    if (isMoving) {
      const { distance, direction } = data
      const dx = direction ? direction.x === 'right' ? 1 : -1 : 0
      setZRate(distance * dx)
    }
  }

  const handleZEnd = () => {
    setZRate(0)
    setIsMoving(false)
  }

  const blurButton = t => {
    while (t.type !== 'button') {
      t = t.parentElement
    }
    t.blur()
  }

  const setAxes = (positions, e) => {
    e.preventDefault()
    const { target } = e
    const { x, y, z } = positions
    controllerCommand('gcode', 'G90')
    controllerCommand(
      'gcode',
      `G0${moveAxis('X', x)}${moveAxis('Y', y)}${moveAxis('Z', z)}`
    )
    blurButton(target)
  }

  const setLock = (lockFunc, newValue, e) => {
    e.preventDefault()
    const { target } = e
    lockFunc(newValue)
    blurButton(target)
  }

  useEffect(() => {
    var timerId
    if (isMoving && (xRate !== 0 || yRate !== 0 || zRate !== 0)) {
      timerId = setInterval(() => {
        const sens = xySens ? 0.2 : 1
        const cmds = {
          x: xRate * MAXSPEED.x * sens * (xLock ? 0 : 1),
          y: yRate * MAXSPEED.y * sens * (yLock ? 0 : 1),
          z: zRate * MAXSPEED.z * (zSens ? 0.2 : 1)
        }
        jogCmd(cmds)
      }, UPDATE_INTERVAL)
    } else {
      if (timerId) {
        clearInterval(timerId)
      }
    }
    return () => { if (timerId) {
      clearInterval(timerId)
    } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMoving, xRate, yRate, zRate, xySens, zSens, xLock, yLock])

  const xyBtns = [
    {
      title: "sensitivity",
      onClick: e => {
        e.preventDefault()
        const { target } = e
        setXYSens(!xySens)
        target.blur()
      },
      label: senseLabel(xySens)
    },
    {
      title: "Set X to 0",
      onClick: e => setAxes({ x: 0 }, e),
      label: 'X0'
    },
    {
      title: "Set Y to 0",
      onClick: e => setAxes({ y: 0 }, e),
      label: 'Y0'
    }
  ]

  const zBtns = [
    {
      title: "sensitivity",
      onClick: e => {
        e.preventDefault()
        const { target } = e
        setZSens(!zSens)
        target.blur()
      },
      label: senseLabel(zSens)
    },
    {
      title: "Set Z to 0",
      onClick: e => setAxes({ z: 0 }, e),
      label: 'Z0'
    },
    {
      title: "Set all to 0",
      onClick: e => setAxes({ x: 0, y: 0, z: 0 }, e),
      label: 'O'
    }
  ]

  return (
    <Row className="mt-2 align-items-end">
      <Col sm={6}>
        <Row>
          <Col sm={{ span: 4, offset: 2 }}>
            <LockButtons
              arrow1={faArrowLeft}
              arrow2={faArrowRight}
              title={'Lock X axis'}
              onClick={e => setLock(setXLock, !xLock, e)}
              lockValue={xLock}
              isDisabled={isDisabled}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <LockButtons
              arrow1={faArrowUp}
              arrow2={faArrowDown}
              title={"Lock Y axis"}
              onClick={e => setLock(setYLock, !yLock, e)}
              lockValue={yLock}
              vertical={true}
              isDisabled={isDisabled}
            />
          </Col>
          <Col sm={4}>
            <Joystick
              color={'red'}
              onStart={handleStart}
              onMove={handleXYMove}
              onEnd={handleXYEnd}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 4, offset: 2 }}>
            <ActionButtons
              buttons={xyBtns}
              title={'XY axes'}
              isDisabled={isDisabled}
            />
          </Col>
        </Row>
      </Col>
      <Col sm={4}>
        <Row>
          <Col sm={4}>
            <Joystick
              color={'blue'}
              lock={true}
              onStart={handleStart}
              onMove={handleZMove}
              onEnd={handleZEnd}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ActionButtons
              buttons={zBtns}
              title={'Z axis'}
              isDisabled={isDisabled}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
