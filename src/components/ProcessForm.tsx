import { IconButton, TextField } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import ProcessInfo from '../types/ProcessInfo'

interface Props {
    index: number
    processes: ProcessInfo[]
    processesSetter: Function
}
const ProcessForm = (props: Props) => {
    const { index, processes, processesSetter } = props

    /**
     * Removes a process from the 'processes'
     * list using the index provided and updates
     * the state.
     */
    const removeProcessClicked = () => {
        processes.splice(index, 1)
        processesSetter(structuredClone(processes))
    }

    /**
     * Modifies a specific attribute of a ProcessInfo object
     * stored in the processes array depending on the
     * index given and the attribute specified.
     *
     * @param newValue the new value that will be used to modify the process.
     * @param attribute the attribute that will be modified for the ProcessInfo object.
     */
    const processInfoChanged = (
        newValue: number,
        attribute: 'length' | 'ioLength' | 'ioInterval'
    ) => {
        processes[index][attribute] = newValue
        processesSetter(structuredClone(processes))
    }

    return (
        <div className="process-form-row">
            {`Process ${index + 1}`}
            <TextField
                required
                type="number"
                label="Process length"
                variant="standard"
                value={processes[index].length}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    processInfoChanged(+e.target.value, 'length')
                }}
                sx={{
                    maxWidth: '6.5em',
                    minWidth: '6.5em',
                }}
            />
            <TextField
                required
                type="number"
                label="I/O request length"
                variant="standard"
                value={processes[index].ioLength}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    processInfoChanged(+e.target.value, 'ioLength')
                }}
                sx={{
                    maxWidth: '7.5em',
                    minWidth: '7.5em',
                }}
            />
            <TextField
                required
                type="number"
                label="I/O request interval"
                variant="standard"
                value={processes[index].ioInterval}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    processInfoChanged(+e.target.value, 'ioInterval')
                }}
                sx={{
                    maxWidth: '7.5em',
                    minWidth: '7.5em',
                }}
            />
            <IconButton
                color="error"
                size="small"
                onClick={removeProcessClicked}
            >
                <RemoveCircleIcon />
            </IconButton>
        </div>
    )
}

export default ProcessForm