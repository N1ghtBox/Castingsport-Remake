import type {
	GridEditCellProps,
	GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import type { EditableContestant } from "@/types/Contestant";

export const chainValidators =
	(
		...validators: ((
			params: GridPreProcessEditCellProps<number, EditableContestant>,
		) => GridEditCellProps)[]
	) =>
	(params: GridPreProcessEditCellProps<number, EditableContestant>) => {
		for (let i = 0; i < validators.length; i++) {
			const validator = validators[i];

			const validationResponse = validator(params);

			if (validationResponse.error !== false) return validationResponse;
		}

		return { ...params.props, error: false };
	};

export const greaterThan0Validator = (
	params: GridPreProcessEditCellProps<number, EditableContestant>,
): GridEditCellProps => {
	if (params.props.value === undefined)
		return { ...params.props, error: "Wymagana wartość" };

	if (params.props.value < 0)
		return { ...params.props, error: "Wartość musi być w większa o 0" };

	return { ...params.props, error: false };
};

export const lesserThan100Validator = (
	params: GridPreProcessEditCellProps<number, EditableContestant>,
): GridEditCellProps => {
	if (params.props.value === undefined)
		return { ...params.props, error: "Wymagana wartość" };

	if (params.props.value > 100)
		return { ...params.props, error: "Wartość musi być w mniejsza niż 100" };

	return { ...params.props, error: false };
};

export const multipleOfValidator =
	(multipleOf: number) =>
	(
		params: GridPreProcessEditCellProps<number, EditableContestant>,
	): GridEditCellProps => {
		if (params.props.value === undefined)
			return { ...params.props, error: "Wymagana wartość" };

		if (params.props.value % multipleOf !== 0) {
			return {
				...params.props,
				error: `Wartość musi być wielokrotnością ${multipleOf}`,
			};
		}

		return { ...params.props, error: false };
	};
