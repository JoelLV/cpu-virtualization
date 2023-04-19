import ProcessState from '../types/ProcessState.enum'
import Snapshot from '../types/Snapshot.interface'

/**
 * Calculates the turnaround time for each process
 * in the snapshot array given. Returns an array of
 * numbers. Each number corresponds to the turnaround
 * time of a process. The index of this array matches the
 * processes' indexes in the snapshot.processes array.
 *
 * @param snapshots Snapshot objects that will be used to calculate turnaround time.
 * @returns An array of numbers that represent the turnaround time for each process.
 */
export const calcProcessTurnaroundTimes = (snapshots: Snapshot[]): number[] => {
    const turnaroundTimes: number[] = new Array(snapshots[0].processes.length)

    snapshots.forEach(snapshot => {
        snapshot.processes.forEach((process, index) => {
            if (process.status === ProcessState.COMPLETE) {
                turnaroundTimes[index] = process.currentTime - process.startTime
            }
        })
    })
    return turnaroundTimes
}

/**
 * Calculates the response time for each process in the
 * snapshot array given. Returns an array of
 * numbers. Each number corresponds to the turnaround
 * time of a process. The index of this array matches the
 * processes' indexes in the snapshot.processes array.
 *
 * @param snapshots Snapshot objects that will be used to calculate response time.
 * @returns An array of numbers that represent the turnaround time for each process.
 */
export const calcProcessResponseTimes = (snapshots: Snapshot[]): number[] => {
    const responseTimes: number[] = [...new Array(snapshots[0].processes.length)].map(_ => -1)

    snapshots.forEach(snapshot => {
        snapshot.processes.forEach((process, index) => {
            if (
                (process.status === ProcessState.RUNNING ||
                    process.status === ProcessState.COMPLETE) &&
                responseTimes[index] === -1
            ) {
                responseTimes[index] = process.currentTime - 1 - process.startTime // process.currentTime is off by one because the processSnapshot switches state 1 after.
            }
        })
    })
    return responseTimes
}

/**
 * Calculates the average response time of all processses given
 * an array of snapshot objects.
 *
 * @param snapshots An array of snapshot objects used to calculate the average response time.
 * @returns The average response time.
 */
export const calcAvgProcessResponseTimes = (snapshots: Snapshot[]): number => {
    const responseTimes: number[] = calcProcessResponseTimes(snapshots)

    return (
        responseTimes.reduce((sum: number, num: number) => sum + num, 0) /
        snapshots[0].processes.length
    )
}

/**
 * Calculates the average turnaround time of all processses given
 * an array of snapshot objects.
 *
 * @param snapshots An array of snapshot objects used to calculate the average turnaround time.
 * @returns The average turnaround time.
 */
export const calcAverageProcessTurnaroundTimes = (snapshots: Snapshot[]): number => {
    const turnaroundTimes: number[] = calcProcessTurnaroundTimes(snapshots)

    return (
        turnaroundTimes.reduce((sum: number, num: number) => sum + num, 0) /
        snapshots[0].processes.length
    )
}
