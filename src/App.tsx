import {
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'
import { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import './App.css'
import Graph from './components/Graph'
import PolicyForm from './components/PolicyForm'
import PolicyType from './types/PolicyTypes.enum'
import Snapshot from './types/Snapshot.interface'
import { IconButton } from '@mui/material'
import ProcessInfo from './types/ProcessInfo'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const App = () => {
    const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.FIFO)
    const [processes, setProcesses] = useState<ProcessInfo[]>([
        { length: 2, ioLength: 2, ioInterval: 0 },
        { length: 3, ioLength: 0, ioInterval: 2 },
        { length: 6, ioLength: 6, ioInterval: 0 },
    ])
    const [snapshots, setSnapshots] = useState<Snapshot[]>([])

    return (
        <div className="home-page-container">
            <div className="graph-container">
                <Graph />
                <div className="center-container">
                    <IconButton size="medium">
                        <PlayCircleIcon fontSize="large" color="success" />
                    </IconButton>
                </div>
            </div>
            <PolicyForm
                policyTypeSetter={setPolicyType}
                policyType={policyType}
                processes={processes}
                processesSetter={setProcesses}
            />
        </div>
    )
}

export default App
