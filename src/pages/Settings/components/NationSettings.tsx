import { Select } from "antd";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	AllNations,
	flagUrl,
	nationName,
	savedNationCodes,
	saveNationCodes,
} from "@/consts/Nations";

const Flag = ({ code }: { code: string }) => (
	<img
		src={flagUrl(code)}
		alt=""
		width={20}
		className="border border-neutral-300"
	/>
);

export default function NationSettings() {
	const { t } = useTranslation();
	const [codes, setCodes] = useState<string[]>(savedNationCodes);

	const update = (next: string[]) => {
		setCodes(next);
		saveNationCodes(next);
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm text-muted-foreground">
				{t("settings.nations")}
			</span>
			<span className="text-xs text-muted-foreground">
				{t("settings.nationsHint")}
			</span>
			{codes.map((code) => (
				<div
					key={code}
					className="flex items-center gap-2 w-80">
					<Flag code={code} />
					<span className="flex-1">{nationName(code)}</span>
					<span className="text-muted-foreground">{code}</span>
					<Button
						type="button"
						variant="outline"
						title={t("common.delete")}
						onClick={() => update(codes.filter((x) => x !== code))}>
						<Trash2 />
					</Button>
				</div>
			))}
			<Select
				className="w-80"
				showSearch
				value={null}
				placeholder={t("settings.addNation")}
				optionFilterProp="label"
				options={AllNations.filter((x) => !codes.includes(x.value))}
				optionRender={(option) => (
					<span className="flex items-center gap-2">
						<Flag code={String(option.value)} />
						{option.label}
					</span>
				)}
				onChange={(value: string) => update([...codes, value])}
			/>
		</div>
	);
}
