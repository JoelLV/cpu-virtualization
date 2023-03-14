/**
 * Represents a simple description
 * of the behavior of the process.
 * length correlates to the number
 * of timeslots it will take for
 * this process to complete. ioInterval
 * represents the timeslots that will
 * take before this process requests
 * an IO instruction. ioLegnth represents
 * the number of timeslots it will take
 * for each IO instruction to complete.
 */
interface Process {
    length: number
    ioInterval: number
    ioLength: number
    arrivalTime: number
}

export default Process
