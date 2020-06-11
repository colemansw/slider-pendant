import React from 'react'
import Button from 'react-bootstrap/Button'

const ControlButton = ({
  title,
  handleClick,
  children,
  isDisabled,
  variant='outline-dark'
}) => {
  return (
    <Button variant={variant} title={title} block disabled={isDisabled} onClick={handleClick}>
      {children}
    </Button>
  )
}

export default ControlButton
