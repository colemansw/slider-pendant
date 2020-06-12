import React from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

function CommandButton(props) {
  const {
    title,
    children,
    handleClick,
    variant = 'outline-dark',
    size = 2,
  } = props

  const clickHandler = (e) => {
    e.preventDefault()
    handleClick()
    e.target.blur()
  }
  return (
    <Col xs={size}>
      <div className="mx-1">
        <Button variant={variant} title={title} onClick={clickHandler} block>
          {children}
        </Button>
      </div>
    </Col>
  )
}

export default CommandButton
