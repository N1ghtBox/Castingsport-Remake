import { Autocomplete, createFilterOptions, InputBase } from "@mui/material";
import {
	type GridRenderEditCellParams,
	useGridApiContext,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useRef, useState } from "react";

// Keys the grid would otherwise use to save/cancel the row or move focus while the suggestion list is open.
// Tab is intentionally left to the grid so it keeps moving to the next cell.
const POPUP_KEYS = ["Enter", "Escape", "ArrowUp", "ArrowDown"];

// Name suggestions come from every competition, so keep the rendered list short.
const filterOptions = createFilterOptions<string>({ limit: 50 });

type GridAutocompleteInputProps = GridRenderEditCellParams & {
	// Suggestions on top of the values already used in this column of the current grid.
	extraOptions?: string[];
};

export default function GridAutocompleteInput(
	props: GridAutocompleteInputProps,
) {
	const { id, value, field, hasFocus, extraOptions } = props;
	const apiRef = useGridApiContext();
	const [open, setOpen] = useState(false);
	const [keyboardOpened, setKeyboardOpened] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus the input when keyboard navigation (e.g. Tab) lands on this cell.
	useEffect(() => {
		if (hasFocus) inputRef.current?.focus();
	}, [hasFocus]);

	const options = useMemo(() => {
		const unique = new Set<string>(extraOptions);
		for (const row of apiRef.current.getRowModels().values()) {
			const option = (row[field] as string | undefined)?.trim();
			if (option) unique.add(option);
		}
		return [...unique].sort((a, b) => a.localeCompare(b));
	}, [apiRef, field, extraOptions]);

	return (
		<Autocomplete
			freeSolo
			fullWidth
			disableClearable
			options={options}
			filterOptions={filterOptions}
			value={value ?? ""}
			open={open}
			// Opening with the arrow keys highlights the first suggestion right away; typing keeps the typed text as-is.
			autoHighlight={keyboardOpened}
			onOpen={(event) => {
				setKeyboardOpened(event.type === "keydown");
				setOpen(true);
			}}
			onClose={() => setOpen(false)}
			// Runs on the Autocomplete root, so the Autocomplete still handles the key; it just doesn't reach the grid.
			onKeyDown={(e) => {
				if (open && POPUP_KEYS.includes(e.key)) e.stopPropagation();
			}}
			slotProps={{
				// Let the list grow wider than a narrow column so options stay on one line.
				popper: {
					placement: "bottom-start",
					sx: { width: "max-content !important", minWidth: 180, maxWidth: 400 },
				},
				listbox: {
					sx: {
						"& .MuiAutocomplete-option": {
							display: "block",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							// The MUI theme is light-mode, so its default highlight is invisible on the dark popup.
							"&.Mui-focused": { backgroundColor: "var(--accent)" },
							'&[aria-selected="true"]': {
								backgroundColor: "rgba(96, 52, 255, 0.3)",
								"&.Mui-focused": { backgroundColor: "rgba(96, 52, 255, 0.5)" },
							},
						},
					},
				},
			}}
			onInputChange={(_, newValue, reason) => {
				if (reason === "input") setKeyboardOpened(false);
				apiRef.current.setEditCellValue({ id, field, value: newValue });
			}}
			renderInput={(params) => (
				<InputBase
					ref={params.InputProps.ref}
					inputProps={params.inputProps}
					inputRef={inputRef}
					fullWidth
					sx={{ px: "10px", height: "100%", fontSize: "inherit" }}
				/>
			)}
		/>
	);
}
