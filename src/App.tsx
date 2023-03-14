import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import './App.css'
import Graph from './components/Graph'
import PolicyForm from './components/PolicyForm'
import PolicyType from './types/PolicyTypes.enum'
import Snapshot from './types/Snapshot.interface'
import { IconButton, Slider } from '@mui/material'
import Process from './types/Process'
import Scheduler from './types/Scheduler.interface'
import Fifo from './policies/Fifo.class'
import RoundRobin from './policies/RoundRobin.class'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const App = () => {
    const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.FIFO)
    const [showingSnapshots, setShowingSnapshots] = useState<boolean>(false)
    const [processes, setProcesses] = useState<Process[]>([])
    const [currSnapshotIndex, setCurrSnapshotIndex] = useState<number>(0)
    const [snapshots, setSnapshots] = useState<Snapshot[]>([])
    const [contextSwitchInterval, setContextSwitchInterval] = useState<number>(1)

    /**
     * Returns an array of snapshot
     * objects obtained from
     * calling the appropriate
     * getSnaphots method of
     * the selected scheduler,
     * which is determined by
     * the state variable 'policyType'.
     *
     * @returns The resulting snapshot
     * array which represents the state
     * of each process at every timeslot
     * specified.
     */
    const getSnapshotsFromPolicy = (): Snapshot[] => {
        let scheduler: Scheduler | undefined = undefined
        switch (policyType) {
            case PolicyType.FIFO:
                scheduler = new Fifo(processes)
                break
            case PolicyType.ROUND_ROBIN:
                scheduler = new RoundRobin(processes, contextSwitchInterval)
                break
        }
        return scheduler.getSnapshots()
    }

    /**
     * Toggles between displaying
     * snapshots or editing processes.
     * It will also set the appropriate
     * scheduler according to the
     * value of the state stored in
     * 'policyType'. The state value
     * for 'snapshots' will also be
     * modified depending on the selected
     * scheduling policy.
     */
    const playButtonClicked = () => {
        if (!showingSnapshots) {
            setSnapshots(getSnapshotsFromPolicy())
        } else {
            setSnapshots([])
            setCurrSnapshotIndex(0)
        }

        setShowingSnapshots(prevValue => !prevValue)
    }

    /**
     * Event triggered when the value
     * of the slider changes. Modifies
     * the value stored in the
     * state variable 'currSnapshotIndex'
     * to display the appropriate snapshot.
     * Had to use type any since MaterialUI
     * does not provide a specific type for
     * the event.
     *
     * @param e Event object.
     */
    const sliderValueChanged = (e: any) => {
        setCurrSnapshotIndex(+e.target.value - 1)
    }

    /**
     * Moves the current snapshot index to the direction
     * specified if the index is not at the limits.
     * If the index is at the limit, the action will
     * be ignored.
     *
     * @param direction Specifies in which direction to move the snaphshot index.
     */
    const moveSnapshotIndex = (direction: -1 | 1) => {
        const notAtTheBorders: boolean =
            (direction === 1 && currSnapshotIndex + 1 < snapshots.length) ||
            (direction === -1 && currSnapshotIndex - 1 >= 0)

        if (notAtTheBorders) {
            setCurrSnapshotIndex(prevValue => prevValue + direction)
        }
    }

    return (
        <div className="home-page-container">
            <div className="graph-container">
                <Graph snapshot={snapshots[currSnapshotIndex]} />
                {showingSnapshots && (
                    <Slider
                        aria-label="Snapshot slider"
                        valueLabelDisplay="auto"
                        marks
                        min={1}
                        max={snapshots.length}
                        onChange={sliderValueChanged}
                        value={currSnapshotIndex + 1}
                    />
                )}
                <div className="center-container">
                    {showingSnapshots && (
                        <IconButton
                            size="medium"
                            onClick={() => {
                                moveSnapshotIndex(-1)
                            }}
                        >
                            <ArrowCircleLeftIcon fontSize="large" color="secondary" />
                        </IconButton>
                    )}
                    <IconButton size="medium" onClick={playButtonClicked}>
                        {showingSnapshots ? (
                            <CancelIcon fontSize="large" color="error" />
                        ) : (
                            <PlayCircleIcon fontSize="large" color="success" />
                        )}
                    </IconButton>
                    {showingSnapshots && (
                        <IconButton
                            size="medium"
                            onClick={() => {
                                moveSnapshotIndex(1)
                            }}
                        >
                            <ArrowCircleRightIcon fontSize="large" color="secondary" />
                        </IconButton>
                    )}
                </div>
            </div>
            <PolicyForm
                policyTypeSetter={setPolicyType}
                policyType={policyType}
                processes={processes}
                processesSetter={setProcesses}
                showingSnapshots={showingSnapshots}
                contextSwitchInterval={contextSwitchInterval}
                contextSwitchIntervalSetter={setContextSwitchInterval}
            />
        </div>
    )
}

export default App
