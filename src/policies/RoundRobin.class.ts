import Process from '../types/Process'
import ProcessSnapshot from '../types/ProcessSnapshot.interface'
import ProcessState from '../types/ProcessState.enum'
import Scheduler from '../types/Scheduler.interface'
import Snapshot from '../types/Snapshot.interface'

class RoundRobin implements Scheduler {
    constructor(private processes: Process[], private contextSwitchInterval: number) {}

    /**
     * Calculates the number of timeslots needed
     * for a process to complete.
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
     * Determines the next potential process
     * index after searching for another process
     * that has a status 'ready' or 'blocked'.
     * The index return can be the same index
     * if there are no other candidates available.
     *
     * @param timeslot the current timeslot that the scheduler is in.
     * @param currActiveIndex the index of the process that is currently running.
     * @returns the new active process index.
     */
    getNewActiveIndexAfterContextSwitch(
        timeslot: number,
        currActiveIndex: number,
        timeslotOfCompletion: number[]
    ): number {
        let processIndex: number = currActiveIndex
        do {
            processIndex = processIndex + 1 >= this.processes.length ? 0 : processIndex + 1
            if (
                timeslotOfCompletion[processIndex] === -1 &&
                this.processHasArrived(timeslot, processIndex)
            ) {
                break
            }
        } while (processIndex !== currActiveIndex)

        return processIndex
    }

    /**
     * Determines whether a process has already
     * arrived or not according to the timeslot
     * given and the index of the process.
     *
     * @param timeslot timeslot that the scheduler is currently in.
     * @param processIndex process index of the this.processes array to compare.
     * @returns whether the process has arrived or not.
     */
    processHasArrived(timeslot: number, processIndex: number): boolean {
        return timeslot >= this.processes[processIndex].arrivalTime
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
     * Determines the process snapshot according
     * to a particular timeslot.
     *
     * @param timeslot current timeslot that the scheduler is currently in.
     * @param processIndex the index of the process currently being analyzed.
     * @param activeProcessIndex the index of the process that is currently being executed by the scheduler.
     * @param timeslotOfCompletion an array of numbers that represent the timeslot that a particular process finished.
     * @param timeslotsBeforeCompletion an array of numbers that represent the number of timeslots left before every process finishes.
     * @param blockedProcessesCounter an array of numbers that represent the number of timeslots left before a I/O call per process.
     * @param blockedTimeslots an array of numbers that represent the number of timeslots since the last I/O call per process.
     * @returns a process snapshot object which represents the state of a particular process at a specific timeslot.
     */
    getProcessSnapshot(
        timeslot: number,
        processIndex: number,
        activeProcessIndex: number,
        timeslotOfCompletion: number[],
        timeslotsBeforeCompletion: number[],
        blockedProcessesCounter: number[],
        blockedTimeslots: number[]
    ): ProcessSnapshot {
        let status: ProcessState = ProcessState.NOT_ARRIVED
        let startTime: number = 0
        let currentTime: number = 0

        if (!this.processHasArrived(timeslot, processIndex)) {
            return {
                status,
                startTime,
                currentTime,
            }
        } else {
            startTime = this.processes[processIndex].arrivalTime
            currentTime = timeslot

            if (
                blockedProcessesCounter[processIndex] <= 0 &&
                this.processes[processIndex].ioInterval > 0
            ) {
                status = ProcessState.BLOCKED
                if (blockedTimeslots[processIndex] >= this.processes[processIndex].ioLength) {
                    // Process completed I/O call. Reset all counters.
                    blockedProcessesCounter[processIndex] = this.processes[processIndex].ioInterval
                    blockedTimeslots[processIndex] = 0
                    if (processIndex === activeProcessIndex) {
                        status = ProcessState.RUNNING
                        --timeslotsBeforeCompletion[processIndex]
                    } else {
                        status = ProcessState.READY
                    }
                } else {
                    ++blockedTimeslots[processIndex]
                    --timeslotsBeforeCompletion[processIndex]
                }
                --blockedProcessesCounter[processIndex]
            } else if (processIndex === activeProcessIndex) {
                status = ProcessState.RUNNING
                --timeslotsBeforeCompletion[processIndex]
                --blockedProcessesCounter[processIndex]
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
     * Simulates the Round-Robin scheduling
     * policy by returning a snapshot
     * of the state of each process
     * for each timeslot.
     *
     * @returns An array of snapshot objects that represent the state of each process per timeslot.
     */
    getSnapshots(): Snapshot[] {
        const timeslotsBeforeCompletion: number[] = this.processes.map(
            (process: Process): number => {
                return this.getTimeslotsNeededForProcess(process)
            }
        )
        const timeslotOfCompletion: number[] = this.processes.map((_): number => {
            return -1
        })
        const blockedProcessesCounter: number[] = this.processes.map((process: Process): number => {
            return process.ioInterval
        })
        const blockedTimeslots: number[] = this.processes.map((_): number => {
            return 0
        })
        const snapshots: Snapshot[] = []

        let contextSwitchCounter: number = this.contextSwitchInterval - 1
        let currTimeslot: number = 1
        let currSnapshot: Snapshot
        let currRunningProcessIndex: number = this.getNewActiveIndexAfterContextSwitch(
            0,
            0,
            timeslotOfCompletion
        )
        do {
            currSnapshot = {
                processes: [],
            }
            this.processes.forEach((_, index: number) => {
                const processSnapshot: ProcessSnapshot = this.getProcessSnapshot(
                    currTimeslot,
                    index,
                    currRunningProcessIndex,
                    timeslotOfCompletion,
                    timeslotsBeforeCompletion,
                    blockedProcessesCounter,
                    blockedTimeslots
                )
                currSnapshot.processes.push(processSnapshot)
            })
            if (contextSwitchCounter <= 0 || timeslotOfCompletion[currRunningProcessIndex] !== -1) {
                currRunningProcessIndex = this.getNewActiveIndexAfterContextSwitch(
                    currTimeslot,
                    currRunningProcessIndex,
                    timeslotOfCompletion
                )
                contextSwitchCounter = this.contextSwitchInterval
            }
            --contextSwitchCounter

            snapshots.push(currSnapshot)
            ++currTimeslot
        } while (!this.workloadIsCompleted(currSnapshot.processes))

        return snapshots
    }
}

export default RoundRobin
