// import {controllerCommand} from '../lib/controller'
// import { SET_GRBL_OUTPUT } from '../actions/types'
// import { RX_BUFFER_SIZE } from '../lib/constants'

/**
 * Return the G-Code string
 * @param {Object} p The position to move to (x,y,z)
 * @param {Number} t The duration of the move (seconds)
 * @param {Boolean} o True for open shutter
 */
const modalGroup = (p, t, o) => `G1 X${p.x.toFixed(3)} Y${p.y.toFixed(3)} Z${p.z.toFixed(3)} S${255 * o} F${(60 / t).toFixed(2)}\n`

/**
 * Generate lines of G-Code for every frame
 * @param {Object} p1 The starting position {x, y, z}
 * @param {Object} p2 The end position {x, y, z}
 * @param {Boolean} isFirst Is this the first transition
 * @param {Object} t The transition {frames, interval, shutter}
 */
function* gCode(p1, p2, isFirst, t) {
  const { frames, interval, shutter } = t
  if (frames > 0) { //  G-code is controlling the time lapse.
   // When shutter is 0 use the camera 'Bulb' setting
    const s = shutter === 0 ? 0.2 : shutter 

    // Two lines of g-code are generated for each frame except the last.
    // Get the differences between the current and next locations.
    const d = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z }
 
    // Find the amount (div) to divide the total distance by to get the
    // distance travelled (cd) when the shutter is closed:
    // od / cd = s / (i - s)
    // od = s * cdcdcd / (i - s) ...(1)
    // div = total distance / cd ...(2)
    // If first transition:
    // |od|cdcdcd|od|cdcdcd|od|cdcdcd|od|...|cdcdcd|od|cdcdcd|od|cdcdcd|od|
    // |f1| frame 2 | frame 3 | frame 4 |...|frame n-2|frame n-1| frame n |
    // --------------------------------------------------------------------
    // total distance = od * frames + cd * (frames - 1) ...(3)
    // (1), (2) & (3) ---> div = s * frames / (interval - s) + frames - 1
    // otherwise:
    // |cdcdcd|od|cdcdcd|od|cdcdcd|od|cdcdcd|od|...|cdcdcd|od|cdcdcd|od|
    // | frame 1 | frame 2 | frame 3 | frame 4 |...|frame n-1| frame n | 
    // ----------------------------------------------------------------
    // total distance = od * (od + cd) * frames      ...(4)
    // (1), (2) & (4) ---> div = interval * frames / (interval - s)

    const div = isFirst ? s * frames / (interval - s) + frames - 1 : interval * frames / (interval - s) 
    const fod = s / (interval - s)
    const cd = { x: d.x / div, y: d.y / div, z: d.z / div }
    const od = { x: cd.x * fod, y: cd.y * fod, z: cd.z * fod }

    let f = frames
    if (isFirst) {
      p1 = { x: p1.x + od.x, y: p1.y + od.y, z: p1.z + od.z }
      yield modalGroup(p1, s, true)
      f -= 1
    }
    
    while (f > 0) {
      // add the closed distance deltas to the current locations,
      p1 = { x: p1.x + cd.x, y: p1.y + cd.y, z: p1.z + cd.z }
      // yield the shutter closed line,
      yield modalGroup(p1, interval - s, false)
      // add the open distance deltas to the current locations,
      p1 = { x: p1.x + od.x, y: p1.y + od.y, z: p1.z + od.z }
     // yield the shutter open line.
      yield (modalGroup(p1, s, true))
      f -= 1
    }
  } else { // Camera is doing the time lapse, just do the move.
    yield modalGroup(p2, interval, false)
  }
}

/**
 * Return an object with Number values
 * @param {Object} obj The object with String values to be replaced
 */
const toNumbers = (obj) => {
  const numbers = {}
  Object.keys(obj).forEach((k) => {numbers[k]=Number(obj[k])})
  return numbers
} 

/**
 * 
 * @param {Array} positions
 * @param {Array} transitions
 */
function* gcodeGenerator(positions, transitions) {
  yield 'G93\n'  // G93 - inverse time mode, 
  yield 'M3 S0\n' // M3 - activate shutter, S0 - 0v.
  const start = toNumbers(positions[0])
  yield `G0 X${start.x} Y${start.y} Z${start.z}\n`
  let index = 0
  for(let t of transitions) {
    yield* gCode(toNumbers(positions[index]), toNumbers(positions[index + 1]), index===0, toNumbers(t))
    index++
  } 
  yield 'M5' // M5 deactivate shutter
}

function gcodeBlob(state) {
  const options = {type: 'text/plain'}
  var blob = new Blob([], options)
  for (let line of gcodeGenerator(state.positions, state.transitions)) {
    console.log(line)
    blob = new Blob([blob, line], options)
  }
  return blob
} 

export default gcodeBlob