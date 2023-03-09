/**
 * Represents the current
 * state of a process. The
 * value of the enum will
 * determine how the graph
 * will render a particular
 * process.
 */
enum ProcessState {
    blocked,
    running,
    ready,
    notArrived,
    complete
}

export default ProcessState