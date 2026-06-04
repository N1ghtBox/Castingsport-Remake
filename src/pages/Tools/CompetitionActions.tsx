import { BugIcon, Calendar, File } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActionCard } from "@/components/ActionCard";
import { useBaseContext } from "@/context/base/BaseContext";
import { PathProvider } from "@/providers/PathProvider/provider";

const CompetitionActions = () => {
	const { debugMode } = useBaseContext();
	const { t } = useTranslation();

	const actions = [
		{
			title: t("actions.timeline"),
			url: "timeline",
			description: t("actions.timelineDesc"),
			icon: <Calendar />,
			content: t("actions.timelineContent"),
		},
		{
			title: t("actions.scoreTable"),
			url: "scoreTable",
			description: t("actions.scoreTableDesc"),
			icon: <File />,
			content: t("actions.scoreTableContent"),
		},
	];

	return (
		<div className="h-full grid grid-cols-2 grid-rows-3 @5xl/main:grid-cols-2 gap-4 p-[15px]">
			{actions.map((action) => (
				<ActionCard
					key={action.url}
					{...action}
				/>
			))}
			{debugMode && (
				<ActionCard
					title={t("actions.devTools")}
					icon={<BugIcon />}
					description={t("actions.devToolsDesc")}
					content=""
					url={PathProvider.competition.debug}
				/>
			)}
		</div>
	);
};

export default CompetitionActions;
