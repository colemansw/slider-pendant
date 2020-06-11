import React from 'react'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBed,
  faChevronLeft,
  faHome,
  faList,
  faUndo,
  faUnlock
} from '@fortawesome/free-solid-svg-icons'
import { controllerCommand } from '../../lib/controller'

export default function DropdownMenu() {
  return (
    <Col xs={2}>
      <div className="mx-1">
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-dark"
            block
            id="dropdownMenuButton"
          >
            <FontAwesomeIcon icon={faList} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => controllerCommand('homing')}>
              <FontAwesomeIcon icon={faHome} />{" Homing"}
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => controllerCommand('gcode', '$SLP')}>
              <FontAwesomeIcon icon={faBed} />{" Sleep"}
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => controllerCommand('unlock')}>
              <FontAwesomeIcon icon={faUnlock} />{" Unlock"}
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={()=> controllerCommand('reset')}>
              <FontAwesomeIcon icon={faUndo} />{" Reset"}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Link className="dropdown-item " to="/workspace">
              <FontAwesomeIcon icon={faChevronLeft} />
              <span className="back-link">{" Back"}</span>
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Col>
  )
}
