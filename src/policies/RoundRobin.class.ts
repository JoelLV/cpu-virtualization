import ProcessForm from "../types/ProcessForm.interface";
import Scheduler from "../types/Scheduler.interface";
import Snapshot from "../types/Snapshot.interface";

class RoundRobin implements Scheduler {

    constructor(public processes: ProcessForm[]) {}

    /**
     * Simulates the Round-Robin scheduling
     * policy by returning a snapshot
     * of the state of each process
     * for each timeslot.
     * 
     * @returns An array of snapshot objects that represent the state of each process per timeslot.
     */
    getSnapshots(): Snapshot[] {
        return []
    }
}

export default RoundRobin