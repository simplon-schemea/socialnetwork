export interface BackendError {
    error: string;
    errors?: {
        arguments: any[]
        bindingFailure: boolean
        code: string
        codes: string[]
        defaultMessage: string
        field: string
        objectName: string
        rejectedValue: string
    }[],
    message: string;
    path: string;
    status: number;
    timestamp: string;
}


export function isBackendError(value: any): value is BackendError{
    return value.message && value.error && value.status;
}
