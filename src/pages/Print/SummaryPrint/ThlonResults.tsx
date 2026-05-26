import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PrintWarning from "@/components/PrintWarning";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import type { Contestant } from "@/types/Contestant";
import { getThlonName } from "@/utils/contestUtils";
import PrintDocument from "./components/PrintDocument";

export type ResultRow = {
	number: string;
	name: string;
	club: string;
	category: string;
};

export type ContestantWithThlonResult = Contestant & {
	place: number;
	total: number;
};

export default function ThlonResults() {
	const {
		results,
		category,
		thlon: { from, to },
	} = useThlonContext();
	const { compInfo } = useCompetitionContext();

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				category={category || "--"}
				from={from}
				to={to}
				results={results}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={compInfo}
				category={category || "--"}
				from={from}
				to={to}
				results={results}
			/>,
		);
	}, [compInfo, category, from, to, results, updateInstance]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				hasCategoryCombobox
				thlons
				invalid={!category}
				printName={`${getThlonName(from, to)}-${category}.pdf`}
			/>
			<PrintDisplay
				instance={instance}
				invalidComponent={
					!category ? (
						<PrintWarning warning="Należy wybrać kategorie" />
					) : undefined
				}
			/>
		</>
	);
}
