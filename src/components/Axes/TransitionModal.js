import React from 'react'
import useForm from 'react-hook-form'
import { Button, Modal, Form } from 'react-bootstrap';
import { SET_TRANSITION, SET_MODAL, ADD_TRANSITION, ADD_POSITION } from '../../actions/types';

function TransitionModal({ state, dispatch }) {

  const { currentIndex, currentTransition, showModal } = state

  const { register, handleSubmit } = useForm()

  const handleClose = () => dispatch({ type: SET_MODAL, payload: false })
  
  const submitForm = data => {
    Object.keys(data).forEach((k) => data[k] = Number(data[k]))
    dispatch({ type: SET_MODAL, payload: false })
    if (currentIndex === null) {
      // This is a new position, so add it to the 'state.positions' array,
      // and add a transition to between it and the last position.
      dispatch({ type: ADD_TRANSITION, payload: data })
      dispatch({ type: ADD_POSITION, payload: state.machinePosition })
    } else {
      dispatch({ type: SET_TRANSITION, payload: { index: currentIndex, ...data } })
    }
  }
  
  return (
    <Modal show={showModal} onHide={handleClose} keyboard={true} > 
      <Modal.Header closeButton={true}>
        <Modal.Title>Set transition</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Modal.Body>
          <Form.Group controlId="transForm.Frames">
            <Form.Label>Frames</Form.Label>
            <Form.Control
              as="input"
              name="frames"
              type="text"
              ref={register}
              defaultValue={currentTransition.frames}
            />
          </Form.Group>
          <Form.Group controlId="transForm.Interval">
            <Form.Label>Interval</Form.Label>
            <Form.Control
              as="input"
              name="interval"
              type="text"
              ref={register}
              defaultValue={currentTransition.interval}
            />
          </Form.Group>
          <Form.Group controlId="transForm.Shutter">
            <Form.Label>Shutter</Form.Label>
            <Form.Control
              as="input"
              name="shutter"
              type="text"
              ref={register}
              defaultValue={currentTransition.shutter}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default TransitionModal
