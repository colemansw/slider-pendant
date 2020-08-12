import controller from '../lib/controller'

import { METRIC_UNITS } from '../lib/constants'

export const getInitialState = () => {
  return {
    port: '',  // Form default - from cookie
    ports: [],
    controllerType: '', // Form default - from cookie
    controller: {
      type: controller.type,
      state: controller.state,
      connected: controller.connected,
      command: controller.command
    },
    activeState: null,
    workflow: {
      state: controller.workflow.state
    },
    machinePosition: { // Machine position
      x: '0.000',
      y: '0.000',
      z: '0.000',
      a: '0.000'
    },
    workPosition: { // Work position
      x: '0.000',
      y: '0.000',
      z: '0.000',
      a: '0.000'
    },
    baudrate: null, // Form default - from cookie
    /*
    For development
    ---------------
    To get the token to enable authentication when a login is required,
    first use port 8000 to access cncjs and using the web developer tools
    look for the token in local storage
    */
    token: null, // Use token copied as described above for development.
    host: '', // Use '' in production build or `http://${window.location.hostname}:8000` in development build to avoid proxy errors
    step: 1,
    positions: [],
    transitions: [],
    currentTransition: null,
    currentIndex: null,
    showModal: false,
    units: METRIC_UNITS,
    // blobURLs: []
  }
}

