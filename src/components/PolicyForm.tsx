import { FormControl, Button } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
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

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="policy-type-label">Policy</InputLabel>
                <Select
                    labelId="policy-type-label"
                    value={policyType}
                    defaultValue={PolicyType.FIFO}
                    label="Policy"
                    onChange={policyTypeChanged}
                    autoWidth
                >
                    <MenuItem value={PolicyType.FIFO}>FIFO</MenuItem>
                    <MenuItem value={PolicyType.ROUND_ROBIN}>Round Robin</MenuItem>
                </Select>
                <FormHelperText>Select Scheduling Policy</FormHelperText>
                <div className="flex">
                    <Button variant="contained" color="success">Add a New Process</Button>
                </div>
                {
                    processes.map((_, index) => {
                        return (
                            <ProcessForm key={index} />
                        )
                    })
                }
            </FormControl>
        </>
    )
}

export default PolicyForm