import { Box, FormControl, IconButton, TextField } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import PolicyType from '../types/PolicyTypes.enum'
import ProcessInfo from '../types/ProcessInfo'
import ProcessForm from './ProcessForm'

interface Props {
    policyTypeSetter: Function
    policyType: PolicyType
    processes: ProcessInfo[]
    processesSetter: Function
}

const PolicyForm = (props: Props) => {
    const { policyType, policyTypeSetter, processes, processesSetter } = props

    /**
     * Modifies policyType state
     * when the value of the dropdown
     * element selected changes.
     */
    const policyTypeChanged = (e: SelectChangeEvent) => {
        policyTypeSetter(e.target.value)
    }

    /**
     * Adds a new ProcessInfo object to
     * the processes array with default
     * values. Updates the state.
     */
    const newProcessButtonClicked = () => {
        const newProcess: ProcessInfo = {
            length: 1,
            ioLength: 0,
            ioInterval: 0,
        }
        processes.push(newProcess)
        processesSetter(structuredClone(processes))
    }

    return (
        <div>
            <FormControl sx={{ minWidth: 100 }}>
                <InputLabel id="policy-type-label">Policy</InputLabel>
                <Select
                    labelId="policy-type-label"
                    value={policyType}
                    defaultValue={PolicyType.FIFO}
                    label="Policy"
                    onChange={policyTypeChanged}
                    autoWidth
                >
                    <MenuItem value={PolicyType.FIFO}>{PolicyType.FIFO}</MenuItem>
                    <MenuItem value={PolicyType.ROUND_ROBIN}>
                        {PolicyType.ROUND_ROBIN}
                    </MenuItem>
                </Select>
            </FormControl>
            {
                policyType === PolicyType.ROUND_ROBIN && (
                    <TextField
                        required
                        label="CS Interval"
                        type="number"
                        sx={{
                            maxWidth: '9.5em',
                            minWidth: '9.5em',
                        }}
                    />
                )
            }
            <div className="process-form-container">
                <div className="flex">
                    <p>Add a new Process</p>
                    <IconButton
                        size="large"
                        color="success"
                        onClick={newProcessButtonClicked}
                    >
                        <AddCircleIcon fontSize="inherit" />
                    </IconButton>
                </div>
                {
                    processes.length > 0 && (
                        <Box
                            sx={{
                                border: '1px solid grey',
                                padding: '0.5em',
                            }}
                        >
                            {processes.map((_, index) => {
                                return (
                                    <ProcessForm
                                        key={index}
                                        index={index}
                                        processes={processes}
                                        processesSetter={processesSetter}
                                    />
                                )
                            })}
                        </Box>
                    )
                }
            </div>
        </div>
    )
}

export default PolicyForm
