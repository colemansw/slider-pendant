import React, { Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ReactNipple from 'react-nipple'

const ActionButtons = props => {
  const { buttons, title } = props
  return (
    <ButtonGroup aria-label="Button actions">
      {buttons.map((b, i) => (
        <Button
          key={`b_${title.replace(' ', '_')}_${i}`}
          variant="secondary"
          title={b.title}
          onClick={b.onClick}
        >
          {b.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default function Joystick(props) {

  const { title = '', color, onStart, onMove, onEnd, buttons, lock = false } = props

  return (
    <Fragment>
      <ReactNipple
        options={{
          mode: 'static',
          position: { top: '50%', left: '50%' },
          color: color,
          lockX: lock
        }}
        style={{
          width: 'auto',
          height: 150,
          position: 'relative'
        }}
        onStart={onStart}
        onMove={onMove}
        onEnd={onEnd}
      />
      <div className="text-center">
        <ActionButtons buttons={buttons} title={title} />
      </div>
    </Fragment>
  )
}