import { Print } from "@mui/icons-material";
import { Document, Page, StyleSheet, usePDF } from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import usePDFActions from "@/hooks/use-pdf-actions";
import { generateTimelineWithConfigs } from "@/lib/timelineUtils";
import { CompetitonContext } from "@/types/CompetitionContext";
import { ContestNames, Contests } from "@/types/Contestant";
import type { TimelineContestant } from "@/types/TimelineData";
import { TypeOfContest } from "@/utils/contestUtils";
import ScoreTablePlatform from "./Table/ScoreTablePlatfrom";

const styles = StyleSheet.create({
	page: {
		backgroundColor: "transparent",
		width: "100%",
		fontSize: 8,
		fontFamily: "Roboto",
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
});

const ScoreGenerate = () => {
	const navigate = useNavigate();
	const [event, setEvent] = useState<Contests>(Contests.Distance);
	const competitionContext = React.useContext(CompetitonContext);
	const { printPDF, downloadPDF } = usePDFActions();

	const distanceData = React.useMemo(() => {
		const generateTimelineForEvent = generateTimelineWithConfigs(
			competitionContext.compInfo.platformConfig,
			competitionContext.compInfo.orderConfig,
		);

		return generateTimelineForEvent(competitionContext.contestants, event);
	}, [
		competitionContext.contestants,
		competitionContext.compInfo.platformConfig,
		competitionContext.compInfo.orderConfig,
		event,
	]);

	const castCount = TypeOfContest(event) === "single" ? 3 : 2;

	const [instance, updateInstance] = usePDF({
		document: (
			<TimelineDocument
				data={distanceData}
				platfromCount={competitionContext.compInfo.platformConfig[event]}
				event={event}
				castCount={castCount}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<TimelineDocument
				data={distanceData}
				platfromCount={competitionContext.compInfo.platformConfig[event]}
				event={event}
				castCount={castCount}
			/>,
		);
	}, [
		updateInstance,
		distanceData,
		competitionContext.compInfo.platformConfig,
		event,
		castCount,
	]);

	return (
		<>
			<div className="w-full flex gap-5 items-center px-4 h-[8vh]">
				<Button
					variant={"outline"}
					onClick={() => navigate("..")}>
					<ChevronLeft /> Wróć
				</Button>
				<Button
					onClick={async () =>
						await downloadPDF(
							instance.blob,
							`Rozpiska-${competitionContext.compInfo.name}.pdf`,
						)
					}>
					<Download /> {instance.loading ? "Ładowanie..." : "Pobierz"}
				</Button>
				<Button onClick={async () => await printPDF(instance.blob)}>
					<Print /> Drukuj
				</Button>
				<Combobox
					onChange={(val) => setEvent(Number(val))}
					value={event.toString()}
					options={[...ContestNames.entries()]
						.filter((x) => {
							const type = TypeOfContest(x[0]);
							return type === "double" || type === "single";
						})
						.map((x) => ({ label: x[1], value: x[0].toString() }))}
				/>
			</div>
			{instance.loading && <p>Generowanie rozpiski...</p>}
			{instance.error && <p>Error: {instance.error}</p>}

			{instance.url && (
				<div className="h-[92vh]">
					{/* Display PDF in iframe */}
					<iframe
						src={instance.url}
						width="100%"
						height="100%"
						title="PDF Preview"
					/>
				</div>
			)}
		</>
	);
};

export default ScoreGenerate;

type DocumentProps = {
	data: Record<number, TimelineContestant[]>;
	platfromCount: number;
	event: Contests;
	castCount: number;
};

function TimelineDocument({
	data,
	platfromCount,
	event,
	castCount,
}: DocumentProps) {
	return (
		<Document
			title="Contest Results"
			creator="Castingsport Dawid Witczak">
			{Array.from({ length: platfromCount }).map((_, i) => {
				return (
					<Page
						size="A4"
						style={styles.page}
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}>
						<ScoreTablePlatform
							cont={data[i + 1]}
							number={i + 1}
							event={event}
							castCount={castCount}
						/>
					</Page>
				);
			})}
		</Document>
	);
}
