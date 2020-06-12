import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { CncContext } from '../App'
import { controllerClosePort } from '../lib/controller'

const CustomCommands = ({ commands, token }) => {
  return (
    <Fragment>
      {commands.map((command, idx) => (
        <Button
          key={`cc-${idx}`}
          variant="secondary"
          onClick={() => {
            axios
              .post(
                `../api/commands/run/${command.id}`,
                null,
                { params: { token: token } }
              )
              .then(res => console.log(res.status))
              .catch(err => console.warn(err))
          }
          }
        >
          {command.title}
        </Button>
      ))}
    </Fragment>
  )
}

const DisconnectButton = ({ port }) => {

  const history = useHistory();

  const handleDisconnect = (e) => {
    e.preventDefault()
    controllerClosePort(port, () => console.log('Serial port closed'))
    history.push('/connect')
  }

  return port ? (
    <Row className="mb-3 mt-3 justify-content-between">
      <Col xs={8}>
        <div className="active-state">{port}</div>
      </Col>
      <Col xs={3}>
        <Button variant="danger" block onClick={handleDisconnect}>
          <FontAwesomeIcon icon={faPowerOff} />{' Close'}
        </Button>
      </Col>
    </Row>
  ) : null
}

function Workspace() {
  const { state } = useContext(CncContext)
  const [commands, setCommands] = useState([])

  useEffect(() => {
    axios
      .get('../api/commands', {
        params: {
          token: state.token,
          paging: false
        }
      })
      .then(res => {
        if (res.data.records) {
          setCommands(res.data.records)
        }
      })
      .catch(err => console.warn(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <DisconnectButton port={state.port} />
      <Row className="mb-3">
        <Col xs={12}>
          <Link to="/control" className="btn btn-outline-dark btn-block">
            Control
          </Link>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs>
          <ButtonGroup>
            <CustomCommands commands={commands} token={state.token} />
          </ButtonGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Workspace
