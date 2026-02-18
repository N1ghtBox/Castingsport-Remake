import type { Placement } from "@/types/BaseTypes";

export type ExtractRecordValue<T> = T extends Record<
	string | number,
	infer ValueType
>
	? ValueType
	: unknown;

export type KeysOf<T extends object> = keyof T;
export type ValueOf<T extends object> = T[keyof T];

export type TupleToObject<T extends readonly unknown[]> = {
	[K in keyof T]: T[K];
};

export type Action<TArg> = (arg1: TArg) => void;

export type WithoutPlace<T> = Omit<T, "place">;

export type WithPlace<T = unknown> = T & {
	place: number;
};

export type WithSeriePlace<T = unknown> = T & {
	seriePlace: number;
};

export type Editable<T = unknown> = T & {
	isNew: boolean;
};

export type WithTotal<T = unknown> = T & {
	total: number;
};

export type WithScore<T = unknown> = T & {
	score: number;
};

export type WithPlacements<T = unknown> = T & {
	placements: Placement[];
};
