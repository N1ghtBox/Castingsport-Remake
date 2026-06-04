import { useTranslation } from "react-i18next";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const LANGUAGES = [
	{ value: "pl", label: "🇵🇱 Polski" },
	{ value: "en", label: "🇬🇧 English" },
];

export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const current = i18n.resolvedLanguage?.startsWith("en") ? "en" : "pl";

	return (
		<Select value={current} onValueChange={(lang) => i18n.changeLanguage(lang)}>
			<SelectTrigger className="w-40">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{LANGUAGES.map((lang) => (
					<SelectItem key={lang.value} value={lang.value}>
						{lang.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
