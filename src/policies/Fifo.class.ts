import ProcessForm from '../types/Process'
import ProcessState from '../types/ProcessState.enum'
import Scheduler from '../types/Scheduler.interface'
import Snapshot from '../types/Snapshot.interface'

class Fifo implements Scheduler {
    constructor(private processes: ProcessForm[]) { }

    /**
     * Simulates the FIFO scheduling
     * policy by returning a snapshot
     * of the state of each process
     * for each timeslot.
     *
     * @returns An array of snapshot objects that represent the state of each process per timeslot.
     */
    getSnapshots(): Snapshot[] {
        // To be replaced with actual algorithm.
        return [{
            processes: [
                {
                    status: ProcessState.RUNNING,
                    startTime: 0,
                    currentTime: 1,
                },
                {
                    status: ProcessState.READY,
                    startTime: 0,
                    currentTime: 1,
                },
            ],
        },
        {
            processes: [
                {
                    status: ProcessState.RUNNING,
                    startTime: 0,
                    currentTime: 2,
                },
                {
                    status: ProcessState.READY,
                    startTime: 0,
                    currentTime: 2,
                },
            ],
        },
        {
            processes: [
                {
                    status: ProcessState.COMPLETE,
                    startTime: 0,
                    currentTime: 2,
                },
                {
                    status: ProcessState.RUNNING,
                    startTime: 0,
                    currentTime: 3,
                },
            ],
        },]
    }
}

export default Fifo
