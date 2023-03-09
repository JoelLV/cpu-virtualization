/**
 * Represents the current
 * state of a process. The
 * value of the enum will
 * determine how the graph
 * will render a particular
 * process.
 */
enum ProcessState {
    BLOCKED,
    RUNNING,
    READY,
    NOT_ARRIVED,
    COMPLETE,
}

export default ProcessState
