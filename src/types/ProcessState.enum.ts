/**
 * Represents the current
 * state of a process. The
 * value of the enum will
 * determine how the graph
 * will render a particular
 * process.
 */
enum ProcessState {
    BLOCKED = 'Blocked',
    RUNNING = 'Running',
    READY = 'Ready',
    NOT_ARRIVED = 'Not Arrived',
    COMPLETE = 'Complete',
}

export default ProcessState
