import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function SettingsPage() {
	const { t } = useTranslation();

	return (
		<div className="p-6 flex flex-col gap-6">
			<h1 className="text-xl font-semibold">{t("common.settings")}</h1>
			<div className="flex flex-col gap-2">
				<span className="text-sm text-muted-foreground">Język / Language</span>
				<LanguageSwitcher />
			</div>
		</div>
	);
}
