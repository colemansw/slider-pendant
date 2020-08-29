import React from 'react'
import ReactNipple from 'react-nipple'

export default function Joystick(props) {

  const { color, onStart, onMove, onEnd, lock = false } = props

  return (
    <div className="mx-auto">
      <ReactNipple
        options={{
          mode: 'static',
          position: { top: '50%', left: '50%' },
          color: color,
          lockX: lock
        }}
        style={{
          width: 150,
          height: 150,
          position: 'relative'
        }}
        onStart={onStart}
        onMove={onMove}
        onEnd={onEnd}
      />
    </div>
  )
}