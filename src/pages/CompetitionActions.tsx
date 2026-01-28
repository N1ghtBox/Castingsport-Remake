import { Calendar, File } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const actions = [
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
	return (
		<div className="h-full grid grid-cols-3 grid-rows-3 @5xl/main:grid-cols-2 gap-4 p-[15px]">
			{[...actions].map((action) => {
				return (
					<ActionCard
						key={action.url}
						{...action}
					/>
				);
			})}
		</div>
	);
};

export default CompetitionActions;
