import Process from '../types/Process'
import ProcessSnapshot from '../types/ProcessSnapshot.interface'
import ProcessState from '../types/ProcessState.enum'
import Scheduler from '../types/Scheduler.interface'
import Snapshot from '../types/Snapshot.interface'

class Fifo implements Scheduler {
    constructor(private processes: Process[]) {}

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
            sum +=
                Math.floor((process.length - 1) / process.ioInterval) *
                process.ioLength
        }

        return sum
    }

    /**
     * Calculates the number of timeslots needed
     * for a specific process to complete. Takes
     * into consideration the overlaps between
     * other processes and the arrival time
     * of the target process.
     *
     * @param targetProcessIndex index of the process that will be calculated in the processes array
     * @returns the number of timeslots needed for a process to complete.
     */
    getTotalTimeslotsNeededForProcess(targetProcessIndex: number): number {
        const targetProcess: Process = this.processes[targetProcessIndex]
        if (targetProcessIndex === 0) {
            return (
                this.getTimeslotsNeededForProcess(targetProcess) +
                targetProcess.arrivalTime
            )
        } else {
            const overlap: number =
                this.getTotalTimeslotsNeededForProcess(targetProcessIndex - 1) -
                targetProcess.arrivalTime
            return (
                this.getTimeslotsNeededForProcess(targetProcess) +
                targetProcess.arrivalTime +
                (overlap >= 0 ? overlap : 0)
            ) // Do not add overlap if there is no overlap at all. (overlap is negative)
        }
    }

    /**
     * Returns the number of timeslots needed
     * for the processor to complete its
     * workload.
     *
     * @returns the sum of timeslots needed for each process to be completed
     * using FIFO as the scheduling policy.
     */
    getTotalTimeslots(): number {
        return this.getTotalTimeslotsNeededForProcess(this.processes.length - 1)
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
        processIndex: number
    ): ProcessSnapshot {
        let status: ProcessState = ProcessState.NOT_ARRIVED
        let startTime: number = 0
        let currentTime: number = 0

        if (timeslot < process.arrivalTime) {
            // Process has not arrived yet.
            return {
                status,
                startTime,
                currentTime,
            }
        } else {
            const completionTimeslot: number =
                this.getTotalTimeslotsNeededForProcess(processIndex)
            startTime = process.arrivalTime
            currentTime = timeslot

            if (timeslot >= completionTimeslot) {
                status = ProcessState.COMPLETE
                currentTime = completionTimeslot
            } else if (
                processIndex === 0 ||
                timeslot >
                    this.getTotalTimeslotsNeededForProcess(processIndex - 1)
            ) {
                status = ProcessState.RUNNING
            } else {
                status = ProcessState.READY
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
        const timeslotsBeforeIoCall: number[] = this.processes.map(
            (prosess: Process): number => {
                return prosess.ioInterval
            }
        )
        let timeslotsSpentInIoCall: number = 0

        for (
            let timeslot = 1;
            timeslot <= this.getTotalTimeslots();
            timeslot++
        ) {
            const snapshot: Snapshot = {
                processes: [],
            }
            this.processes.forEach((process: Process, index: number) => {
                const processSnapshot: ProcessSnapshot =
                    this.getProcessSnapshot(timeslot, process, index)
                if (
                    processSnapshot.status === ProcessState.RUNNING &&
                    process.ioInterval > 0
                ) {
                    if (timeslotsBeforeIoCall[index] > 0) {
                        // Not in I/O call yet.
                        --timeslotsBeforeIoCall[index]
                    } else if (timeslotsSpentInIoCall >= process.ioLength) {
                        // Spent enough timeslots in I/O call. Reset I/O counter and
                        // timeslots spent in I/O call.
                        timeslotsBeforeIoCall[index] = process.ioInterval
                        timeslotsSpentInIoCall = 0
                    } else {
                        // Still in I/O call. Increment timeslots spent
                        // in I/O call and modify state to BLOCKED.
                        processSnapshot.status = ProcessState.BLOCKED
                        ++timeslotsSpentInIoCall
                    }
                }
                snapshot.processes.push(processSnapshot)
            })
            snapshots.push(snapshot)
        }

        return snapshots
    }
}

export default Fifo
