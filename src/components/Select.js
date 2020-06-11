import React from 'react'
import Form from 'react-bootstrap/Form'

const Select = React.forwardRef(
  ({ prefix, name, label, options, value }, ref) => (
    <Form.Group controlId={`${prefix}.${name}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" name={name} defaultValue={value} ref={ref}>
        {options.map((v, i) => (
          <option key={i.toString()} value={v}>
            {v}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  ))

export default Select