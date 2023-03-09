import ProcessSnapshot from './ProcessSnapshot.interface'

/**
 * Stores the state of each
 * process at a specific
 * snapshot. Used by the
 * graph to appropriately display
 * each process in the current
 * snapshot.
 */
interface Snapshot {
    processes: ProcessSnapshot[]
}

export default Snapshot
