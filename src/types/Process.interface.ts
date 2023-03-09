import ProcessState from "./ProcessState.enum"

/**
 * Stores useful information regarding
 * the process at a specific snapshot. 
 * Mainly used by the graph to display 
 * information accurately. The startTime
 * property correlates to the timeslot
 * the graph will start displaying
 * this process. currentTime correlates
 * to the timeslot the graph will stop
 * displaying this process. status
 * represents the current process's
 * status at a specific snapshot.
 * The graph will display a specific
 * color for this process according
 * to the status specified.
 */
interface ProcessSnapshot {
    status: ProcessState,
    startTime: number,
    currentTime: number
}

export default ProcessSnapshot