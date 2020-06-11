import Connector from 'cncjs-controller'
import io from 'socket.io-client'

const controller = new Connector(io)

const controllerListPorts = () => controller.listPorts()

const controllerOpenPort = (port, options, callback) => controller.openPort(port, options, callback)

const getLoadedControllers = () => controller.loadedControllers

const controllerConnect = (host, token) => {
  controller.connect(host, { query: `token=${token}` })
}
const controllerCommand = (...commands) => {
  controller.command(...commands)
}
const controllerClosePort = (port, callback) => controller.closePort(port, callback)

const controllerWriteln= data => controller.writeln(data)

const addControllerEvents = events => {
  Object.keys(events).forEach(eventName => {
    const callback = events[eventName]
    controller.addListener(eventName, callback)
  })
}

const removeControllerEvents = events => {
  Object.keys(events).forEach(eventName => {
    const callback = events[eventName]
    controller.removeListener(eventName, callback)
  })
}

export {
  controllerListPorts,
  controllerOpenPort,
  controllerClosePort,
  controllerWriteln,
  getLoadedControllers,
  controllerConnect,
  controllerCommand,
  addControllerEvents,
  removeControllerEvents,
}

export default controller