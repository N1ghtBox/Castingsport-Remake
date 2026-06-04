import { useTranslation } from "react-i18next";

export function useCategoryLabel() {
	const { t } = useTranslation();
	return (value: string) => t(`category.${value}` as any, { defaultValue: value });
}

export function useTeamCategoryLabel() {
	const { t } = useTranslation();
	return (value: string) => t(`teamCategory.${value}` as any, { defaultValue: value });
}
