import {
	type GridEditInputCellProps,
	useGridApiContext,
} from "@mui/x-data-grid";
import { useEffect, useRef } from "react";
import { IMaskInput } from "react-imask";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";

export default function GridTimeInput(props: GridEditInputCellProps) {
	const { id, value, field, hasFocus } = props;
	const apiRef = useGridApiContext();
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus the input when keyboard navigation (e.g. Tab) lands on this cell.
	useEffect(() => {
		if (hasFocus) inputRef.current?.focus();
	}, [hasFocus]);

	const validate = (val: string) => {
		const regex = /^\d\.[0-5]\d\.[0-9]\d$/;
		return regex.test(val);
	};

	return (
		<IMaskInput
			inputRef={inputRef}
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
