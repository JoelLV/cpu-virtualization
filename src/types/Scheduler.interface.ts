import Snapshot from './Snapshot.interface'

/**
 * Interface that must be
 * implemented by all policies
 * in order for the graph to
 * render each process correctly
 * for every snapshot.
 */
interface Scheduler {
    /**
     * An array of snapshot objects
     * that store the state of all processes
     * for every snapshot. Used by the graph
     * to get the state of each process
     * in the selected snapshot.
     */
    getSnapshots(): Snapshot[]
}

export default Scheduler
