import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faUnlock
} from '@fortawesome/free-solid-svg-icons'

export const ActionButtons = props => {
  const { buttons, title, isDisabled } = props
  return (
    <ButtonGroup aria-label="Button actions">
      {buttons.map((b, i) => (
        <Button
          key={`b_${title.replace(' ', '_')}_${i}`}
          variant="secondary"
          title={b.title}
          onClick={b.onClick}
          disabled={isDisabled}
        >
          {b.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export const LockButtons = props => {
  const { arrow1, arrow2, title, onClick, lockValue, vertical = false, isDisabled } = props
  return (
    <ButtonGroup vertical={vertical} >
      <Button variant="secondary" title={title} onClick={onClick} disabled={isDisabled}>
        <FontAwesomeIcon icon={arrow1} />
      </Button>
      <Button variant="secondary" title={title} onClick={onClick} disabled={isDisabled}>
        <FontAwesomeIcon icon={lockValue ? faLock : faUnlock} />
      </Button>
      <Button variant="secondary" title={title} onClick={onClick} disabled={isDisabled}>
        <FontAwesomeIcon icon={arrow2} />
      </Button>
    </ButtonGroup>
  )
}
