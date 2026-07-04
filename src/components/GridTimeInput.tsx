import {
	type GridEditInputCellProps,
	useGridApiContext,
} from "@mui/x-data-grid";
import { IMaskInput } from "react-imask";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";

export default function GridTimeInput(props: GridEditInputCellProps) {
	const { id, value, field } = props;
	const apiRef = useGridApiContext();

	const validate = (val: string) => {
		const regex = /^\d\.[0-5]\d\.[0-9]\d$/;
		return regex.test(val);
	};

	return (
		<IMaskInput
			mask="0.50.00"
			value={value}
			overwrite
			definitions={{
				"0": /[0-9]/,
				"5": /[0-5]/,
			}}
			onComplete={(val) => {
				if (!validate(val)) {
					LoggingProvider.LogWarning(`GridTimeInput: invalid value "${val}"`);
				} else {
					apiRef.current.setEditCellValue({ id, field, value: val });
				}
			}}
		/>
	);
}
