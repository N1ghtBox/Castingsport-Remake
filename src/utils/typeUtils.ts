export type ExtractRecordValue<T> = T extends Record<
	string | number,
	infer ValueType
>
	? ValueType
	: unknown;
