import { useTranslation } from "react-i18next";

export function useCategoryLabel() {
	const { t } = useTranslation();
	return (value: string) => t(`category.${value}`, { defaultValue: value });
}

export function useTeamCategoryLabel() {
	const { t } = useTranslation();
	return (value: string) => t(`teamCategory.${value}`, { defaultValue: value });
}
