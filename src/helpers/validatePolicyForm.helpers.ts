import PolicyType from "../types/PolicyTypes.enum"
import Process from "../types/Process"

/**
 * Validates a given number.
 * 
 * @param num number to validate.
 * @returns whether the number given is valid.
 */
const isValidNumber = (num: number): boolean => {
    return !isNaN(+num)
}

/**
 * Validates the data inside a process
 * object. Returns a tuple with a boolean,
 * which represents if the data is valid or not,
 * and a string which contains the error messages.
 * 
 * @param process process object to validate.
 * @returns a tuple which contains the result after validation.
 */
const validateProcessInfo = (process: Process): [boolean, string] => {
    let validData: boolean = true
    let errorMessage: string = ''

    for (let key in process) {
        if (!isValidNumber(process[key as 'length' | 'ioInterval' | 'ioLength' | 'arrivalTime'])) {
            validData = false
            errorMessage += 'One of the values provided is not a number.\n'
        }
    }
    if (process.arrivalTime < 0) {
        validData = false
        errorMessage += 'Arrival time must be greater or equal to 0.\n'
    }
    if (process.length <= 0) {
        validData = false
        errorMessage += 'Process length must be greater than 0.\n'
    }
    if (process.ioInterval > 0) {
        if (process.ioLength <= 0) {
            validData = false
            errorMessage += 'I/O length must be greater than 0.\n'
        }
    }
    
    return [validData, errorMessage]
}

/**
 * Validates the data given in the PolicyForm
 * component. Returns a tuple with its result.
 * 
 * @param processes an array of process objects to validate.
 * @param contextSwitchInterval the context switch interval number to validate.
 * @param policy the currently selected scheduling policy.
 * @returns a tuple with its first element being whether validation succeeded, and a string storing the error message if validation failed.
 */
const validatePolicyForm = (processes: Process[], contextSwitchInterval: number, policy: PolicyType): [boolean, string] => {
    let validData: boolean = true
    let errorMessage: string = ''

    if (policy === PolicyType.ROUND_ROBIN) {
        if (!isValidNumber(contextSwitchInterval)) {
            validData = false
            errorMessage += 'Context switch interval given is not a valid number.\n'
        } else if (contextSwitchInterval <= 0) {
            validData = false
            errorMessage += 'Context switch interval value must be greater than 0.\n'
        }
    }
    if (processes.length <= 0) {
        validData = false
        errorMessage += 'At least one process needs to be specified.\n'
    } else {
        processes.forEach((process: Process, index: number) => {
            const validationResult: [boolean, string] = validateProcessInfo(process)
            if (!validationResult[0]) {
                validData = false
                errorMessage += `Error in Process ${index + 1}: ` + validationResult[1] + '\n'
            }
        })
    }

    return [validData, errorMessage]
}

export default validatePolicyForm