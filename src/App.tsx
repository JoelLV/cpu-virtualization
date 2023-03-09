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
import './App.css'
import Graph from './components/Graph'
import PolicyForm from './components/PolicyForm'
import PolicyType from './types/PolicyTypes.enum'
import Snapshot from './types/Snapshot.interface'
import { Button } from '@mui/material'
import ProcessInfo from './types/ProcessInfo'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const App = () => {
    const [policyType, setPolicyType] = useState<PolicyType>(PolicyType.FIFO)
    const [processes, setProcesses] = useState<ProcessInfo[]>([])
    const [snapshots, setSnapshots] = useState<Snapshot[]>([])

    return (
        <div className="home-page-container">
            <div className="center-container">
                <Graph />
            </div>
            <div className="center-container">
                <Button variant="contained">Start Visualization</Button>
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
