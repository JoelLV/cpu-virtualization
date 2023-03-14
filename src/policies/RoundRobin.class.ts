import Process from '../types/Process'
import ProcessState from '../types/ProcessState.enum'
import Scheduler from '../types/Scheduler.interface'
import Snapshot from '../types/Snapshot.interface'

class RoundRobin implements Scheduler {
    constructor(
        private processes: Process[],
        private contextSwitchInterval: number
    ) {}

    /**
     * Simulates the Round-Robin scheduling
     * policy by returning a snapshot
     * of the state of each process
     * for each timeslot.
     *
     * @returns An array of snapshot objects that represent the state of each process per timeslot.
     */
    getSnapshots(): Snapshot[] {
        // To be replaced with actual algorithm.
        return [
            {
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
                    {
                        status: ProcessState.NOT_ARRIVED,
                        startTime: 0,
                        currentTime: 0,
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
                    {
                        status: ProcessState.NOT_ARRIVED,
                        startTime: 0,
                        currentTime: 0,
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
                        status: ProcessState.BLOCKED,
                        startTime: 0,
                        currentTime: 3,
                    },
                    {
                        status: ProcessState.READY,
                        startTime: 2,
                        currentTime: 3,
                    },
                ],
            },
        ]
    }
}

export default RoundRobin
