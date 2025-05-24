import { type GridEditInputCellProps, useGridApiContext } from "@mui/x-data-grid";
import { IMaskInput } from 'react-imask';

export default function TimeInput(props: GridEditInputCellProps) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const validate = (val: string) => {
        const regex = /^\d\.[0-5]\d\.[0-5]\d$/;
        return regex.test(val);
    };

    return (
        <IMaskInput
            mask="0.50.50"
            value={value}
            overwrite
            definitions={{
                '0': /[0-9]/,
                '5': /[0-5]/,
            }}
            onComplete={(val) => {
                if (!validate(val)) {
                    console.warn('Invalid input:', val);
                } else {
                    apiRef.current.setEditCellValue({ id, field, value: val })
                }
            }}
        />
    )
}