import { Bar } from 'react-chartjs-2'
import ProcessSnapshot from '../types/ProcessSnapshot.interface'
import SquareIcon from '@mui/icons-material/Square'
import ProcessState from '../types/ProcessState.enum'
import Snapshot from '../types/Snapshot.interface'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'

interface Props {
    snapshot: Snapshot
}
const Graph = (props: Props) => {
    const { snapshot } = props
    const processStateColors: Record<ProcessState, string> = {
        Ready: 'lightgreen',
        Running: 'yellow',
        Complete: 'darkgreen',
        'Not Arrived': 'white',
        Blocked: 'red',
    }

    /**
     * Parses the data stored in the snapshot
     * object to a data structure that the
     * graph component can understand.
     *
     * @returns a tuple that stores the data and the colors that will be used for the graph.
     */
    const parseSnapshotData = (): [number[][], string[]] => {
        if (snapshot !== undefined) {
            const data: number[][] = []
            const colors: string[] = []
            for (let i = 0; i < snapshot.processes.length; i++) {
                const process: ProcessSnapshot = snapshot.processes[i]
                data.push([process.startTime, process.currentTime])
                colors.push(processStateColors[process.status])
            }
            return [data, colors]
        }
        return [[], []]
    }

    /**
     * Generates a legend for the graph using the values
     * stored in the record 'processStateColors'.
     * I opted to use a separate legend for the
     * graph instead of using the built-in graph
     * because it was inconvenient to use due
     * to the requirement of using multiple
     * datasets, which does not represent
     * the semantics of this graph.
     *
     * @returns an array of React components that represent the legend of the graph.
     */
    const getLegendComponents = (): ReactJSXElement[] => {
        let index: number = 0
        const components: ReactJSXElement[] = []
        for (let key in processStateColors) {
            if (key !== 'Not Arrived') {
                components.push(
                    <div key={index} className="center-container" style={{ fontSize: '0.7em' }}>
                        {`${key}: `}
                        <SquareIcon
                            key={index}
                            sx={{
                                color: processStateColors[key as ProcessState],
                            }}
                        />
                    </div>
                )
                index++
            }
        }
        return components
    }

    const parsedData: [number[][], string[]] = parseSnapshotData()

    return (
        <>
            <Bar
                options={{
                    indexAxis: 'y' as const,
                    elements: {
                        bar: {
                            borderWidth: 2,
                        },
                    },
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Process Scheduling Visualization',
                        },
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Timeslots',
                            },
                            ticks: {
                                stepSize: 1,
                            },
                            suggestedMax: 30,
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Workload',
                            },
                        },
                    },
                }}
                data={{
                    labels:
                        snapshot !== undefined
                            ? snapshot.processes.map((_, index: number): string => {
                                  return `Process ${index + 1}`
                              })
                            : [],
                    datasets: [
                        {
                            data: parsedData[0],
                            backgroundColor: parsedData[1],
                        },
                    ],
                }}
            />
            {snapshot !== undefined && <div className="legend">{getLegendComponents()}</div>}
        </>
    )
}

export default Graph
