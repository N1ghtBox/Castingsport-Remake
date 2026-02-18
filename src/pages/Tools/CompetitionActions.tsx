import { BugIcon, Calendar, File } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";
import { useBaseContext } from "@/context/base/BaseContext";
import { PathProvider } from "@/providers/PathProvider/provider";

export const actions = [
	{
		title: "Rozpiska zawodów",
		url: "timeline",
		description: "Godziny rozpoczęcia konkurencji",
		icon: <Calendar />,
		content:
			"Lista godzin rozpoczęcia konkurencji, wraz z kolejnością startowania zawodników",
	},
	{
		title: "Listy wynikowe",
		url: "scoreTable",
		description: "Listy do wyników dla konkurencji odległościowych",
		icon: <File />,
		content: "Generuje listy na podstawie harmonogramu",
	},
];

const CompetitionActions = () => {
	const { debugMode } = useBaseContext();

	return (
		<div className="h-full grid grid-cols-2 grid-rows-3 @5xl/main:grid-cols-2 gap-4 p-[15px]">
			{[...actions].map((action) => {
				return (
					<ActionCard
						key={action.url}
						{...action}
					/>
				);
			})}
			{debugMode && <ActionCard
				title="Narzędzia deweloperskie"
				icon={<BugIcon />}
				description={
					"Narzędzia przeznaczone dla twórcy aplikacji. Używanie bez wiedzy grozi usunięciem danych."
				}
				content=""
				url={PathProvider.competition.debug}
			/>}
		</div>
	);
};

export default CompetitionActions;
