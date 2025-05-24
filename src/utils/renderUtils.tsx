import { Check, Close } from "@mui/icons-material"

export const renderCheckIcon = (checked: boolean) => {
    if (checked) return <Check style={{ color: 'green' }} />
    return <Close style={{ color: 'red' }} />
}