import Process from '../types/Process'
import ProcessSnapshot from '../types/ProcessSnapshot.interface'
import ProcessState from '../types/ProcessState.enum'
import Scheduler from '../types/Scheduler.interface'
import Snapshot from '../types/Snapshot.interface'

class Fifo implements Scheduler {
    constructor(private processes: Process[]) { }

    /**
     * Calculates the number of timeslots needed
     * for a process to complete (excludes the
     * number of timeslots not used when
     * the process has not arrived yet and
     * overlaps with other processes).
     *
     * @param process process to calculate.
     * @returns the number of timeslots needed for the process given.
     */
    getTimeslotsNeededForProcess(process: Process): number {
        let sum: number = 0
        sum += process.length
        // Obtains the number of extra timeslots needed to perform the I/O calls.
        if (process.ioInterval > 0) {
            sum += Math.floor((process.length - 1) / process.ioInterval) * process.ioLength
        }

        return sum
    }

    /**
     * Determines which process to run by determining
     * which process has not been completed yet and
     * arrived the earliest.
     * @param timeslotOfCompletion array of numbers that tell at which timeslot the process finished. -1 if the process has not finished yet.
     * @returns the index of the earliest possible process to run
     */
    getNextProcessIndexToRun(timeslotOfCompletion: number[]): number {
        let earliestProcessIndexArrival = 0
        this.processes.forEach((process: Process, index: number) => {
            if (
                process.arrivalTime <= this.processes[earliestProcessIndexArrival].arrivalTime &&
                timeslotOfCompletion[index] === -1
            ) {
                earliestProcessIndexArrival = index
            }
        })
        return earliestProcessIndexArrival
    }

    /**
     * Determines whether the workload has
     * been completed according to the
     * process snapshots given.
     *
     * @param processSnapshots process snapshots used to determine whether the workload has been completed.
     * @returns whether the workload has already been completed or not.
     */
    workloadIsCompleted(processSnapshots: ProcessSnapshot[]): boolean {
        let completed: boolean = true
        processSnapshots.forEach((process: ProcessSnapshot) => {
            if (process.status !== ProcessState.COMPLETE) {
                completed = false
            }
        })
        return completed
    }

    /**
     * Determines the process state
     * of a particular process at a
     * specific timeslot using the
     * rules specified in the Process
     * object and the given timeslot.
     *
     * @param timeslot the timeslot that the scheduler is currently processing.
     * @param process the process in the workload.
     * @param processIndex the index of the process relative to the array this.processes
     * @returns a process snapshot which represents the process state at a particular timeslot.
     */
    getProcessSnapshot(
        timeslot: number,
        process: Process,
        processIndex: number,
        activeProcessIndex: number,
        timeslotsBeforeCompletion: number[],
        timeslotOfCompletion: number[],
        timeslotsBeforeIoCall: number[],
        blockedProcessCounter: number[]
    ): ProcessSnapshot {
        let status: ProcessState = ProcessState.NOT_ARRIVED
        let startTime: number = 0
        let currentTime: number = 0

        if (timeslot <= process.arrivalTime) {
            // Process has not arrived yet.
            return {
                status,
                startTime,
                currentTime,
            }
        } else {
            startTime = process.arrivalTime
            currentTime = timeslot

            if (processIndex === activeProcessIndex) {
                status = ProcessState.RUNNING
                if (process.ioInterval > 0) {
                    if (timeslotsBeforeIoCall[processIndex] <= 0) {
                        if (blockedProcessCounter[processIndex] >= process.ioLength) {
                            timeslotsBeforeIoCall[processIndex] = process.ioInterval
                            blockedProcessCounter[processIndex] = 0
                        } else {
                            status = ProcessState.BLOCKED
                            ++blockedProcessCounter[processIndex]
                        }
                    } else {
                        --timeslotsBeforeIoCall[processIndex]
                    }
                }
                --timeslotsBeforeCompletion[processIndex]
            } else {
                status = ProcessState.READY
            }
            if (timeslotsBeforeCompletion[processIndex] <= 0) {
                status = ProcessState.COMPLETE
                if (timeslotOfCompletion[processIndex] === -1) {
                    timeslotOfCompletion[processIndex] = timeslot
                }
                currentTime = timeslotOfCompletion[processIndex]
            }
        }

        return {
            status,
            startTime,
            currentTime,
        }
    }

    /**
     * Simulates the FIFO scheduling
     * policy by returning a snapshot
     * of the state of each process
     * for each timeslot.
     *
     * @returns An array of snapshot objects that represent the state of each process per timeslot.
     */
    getSnapshots(): Snapshot[] {
        const snapshots: Snapshot[] = []
        const timeslotsBeforeIoCall: number[] = this.processes.map((prosess: Process): number => {
            return prosess.ioInterval
        })
        const timeslotsBeforeCompletion: number[] = this.processes.map(
            (process: Process): number => {
                return this.getTimeslotsNeededForProcess(process)
            }
        )
        const timeslotOfCompletion: number[] = this.processes.map(_ => {
            return -1
        })
        const blockedTimeslots: number[] = this.processes.map(_ => {
            return 0
        })

        let runningProcessIndex: number = this.getNextProcessIndexToRun(timeslotOfCompletion)
        let timeslot = 1
        let snapshot: Snapshot
        do {
            snapshot = {
                processes: [],
            }
            this.processes.forEach((process: Process, index: number) => {
                const processSnapshot: ProcessSnapshot = this.getProcessSnapshot(
                    timeslot,
                    process,
                    index,
                    runningProcessIndex,
                    timeslotsBeforeCompletion,
                    timeslotOfCompletion,
                    timeslotsBeforeIoCall,
                    blockedTimeslots
                )
                if (processSnapshot.status === ProcessState.COMPLETE) {
                    runningProcessIndex = this.getNextProcessIndexToRun(timeslotOfCompletion)
                }
                snapshot.processes.push(processSnapshot)
            })
            snapshots.push(snapshot)
            ++timeslot
        } while (!this.workloadIsCompleted(snapshot.processes))

        return snapshots
    }
}

export default Fifo
