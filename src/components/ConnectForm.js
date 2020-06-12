import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useForm from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Select from './Select'
import {
  controllerListPorts,
  controllerOpenPort,
  getLoadedControllers
} from '../lib/controller'

const rates = ['250000', '115200', '57600', '38400', '19200', '9600', '4800', '2400']

export default function Connect({ state }) {
  const history = useHistory()
  const prefix = 'connectForm'

  useEffect(() => {
    if (state.controller.connected)
    controllerListPorts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.controller.connected])


  const serialConnect = data => {
    controllerOpenPort(data.port, {
      baudrate: Number(data.rate)
    }, (err) => {
      if (err) {
        console.error(err)
        return
      }
      history.push({ pathname: '/control' })
    })
  }

  const { register, handleSubmit } = useForm()

  return (
    <Row className="mt-3">
      <Col xs={8}>
        <Form onSubmit={handleSubmit(serialConnect)}>
          <Select
            prefix={prefix}
            label="Controller type"
            options={getLoadedControllers()}
            name="type"
            value={state.controllerType}
            ref={register({ required: true })}
          />
          <Select
            prefix={prefix}
            label="Ports"
            options={state.ports.map((obj) => obj.port)}
            name="port"
            value={state.port}
            ref={register({ required: true })}
          />
          <Select
            prefix={prefix}
            label="Baudrates"
            options={rates}
            name="rate"
            value={state.baudrate}
            ref={register({ required: true })}
          />
          <Button type="submit">Connect</Button>
        </Form>
      </Col>
    </Row>
  )
}
