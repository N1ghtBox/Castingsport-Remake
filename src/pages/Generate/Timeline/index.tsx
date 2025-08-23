import { Print } from "@mui/icons-material";
import { Document, Page, StyleSheet, usePDF } from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import moment, { type Moment } from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Combobox } from "@/components/Combobox";
import PrintHeader from "@/components/PrintHeader";
import { Button } from "@/components/ui/button";
import usePDFActions from "@/hooks/use-pdf-actions";
import {
	EVENT_ORDER,
	generateTimeline,
	generateTimelineWithConfigs,
} from "@/lib/timelineUtils";
import type Competition from "@/types/Competition";
import { CompetitonContext } from "@/types/CompetitionContext";
import { Contests } from "@/types/Contestant";
import type { TimelineData } from "@/types/TimelineData";
import OverwriteSettings from "./OverwriteSettings/OverwriteSettings";
import TimelineContestTable from "./Table/TimelineContestTable";

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

const TimelineGenerate = () => {
	const navigate = useNavigate();
	const competitionContext = React.useContext(CompetitonContext);
	const { printPDF, downloadPDF } = usePDFActions();
	const [club, setClub] = useState<string>();

	const timelineData = React.useMemo(() => {
		const generateTimelineForEvent = generateTimelineWithConfigs(
			competitionContext.compInfo.platformConfig,
		);

		const data = {
			[Contests.FlySkish]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.FlySkish,
			),
			[Contests.FlyDistance]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.FlyDistance,
			),
			[Contests.Arenberg]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.Arenberg,
			),
			[Contests.Skish]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.Skish,
			),
			[Contests.Distance]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.Distance,
			),
			[Contests.FlyDistanceDoubleHand]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.FlyDistanceDoubleHand,
			),
			[Contests.DistanceDoubleHand]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.DistanceDoubleHand,
			),
			[Contests.MultiSkish]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.MultiSkish,
			),
			[Contests.MultiDistance]: generateTimelineForEvent(
				competitionContext.contestants,
				Contests.MultiDistance,
			),
		} as TimelineData;

		return data;
	}, [
		competitionContext.contestants,
		competitionContext.compInfo.platformConfig,
	]);

	const timeline = useMemo(() => {
		const startDate = moment(competitionContext.compInfo.dateFrom);

		return generateTimeline(
			startDate,
			timelineData,
			competitionContext.compInfo.timeConfig,
		);
	}, [
		timelineData,
		competitionContext.compInfo.timeConfig,
		competitionContext.compInfo.dateFrom,
	]);

	const [instance, updateInstance] = usePDF({
		document: (
			<TimelineDocument
				comp={competitionContext.compInfo}
				data={timelineData}
				club={club}
				timeline={timeline}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<TimelineDocument
				comp={competitionContext.compInfo}
				data={timelineData}
				club={club}
				timeline={timeline}
			/>,
		);
	}, [
		competitionContext.compInfo,
		updateInstance,
		timelineData,
		timeline,
		club,
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
					disabled={instance.loading}
					onClick={async () =>
						await downloadPDF(
							instance.blob,
							`Rozpiska-${competitionContext.compInfo.name}.pdf`,
						)
					}>
					<Download /> {instance.loading ? "Ładowanie..." : "Pobierz"}
				</Button>
				<Button
					disabled={instance.loading}
					onClick={async () => await printPDF(instance.blob)}>
					<Print /> Drukuj
				</Button>
				<Combobox
					placeholder="Wybierz okręg..."
					onChange={(value) => setClub(value)}
					value={club}
					options={Array.from(
						new Set(competitionContext.contestants.map((x) => x.club)),
					).map((x) => ({ label: x, value: x }))}
					allowDeselect={true}
				/>
				<OverwriteSettings />
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

export default TimelineGenerate;

type DocumentProps = {
	comp: Omit<Competition, "id">;
	data: TimelineData;
	timeline: Partial<Record<Contests, Moment>>;
	club: string | undefined;
};

function TimelineDocument({ comp, data, timeline, club }: DocumentProps) {
	return (
		<Document
			title="Contest Results"
			creator="Castingsport Dawid Witczak">
			<Page
				size="A4"
				style={styles.page}>
				<PrintHeader comp={comp} />

				{Array.from(EVENT_ORDER.slice(0, 9)).map((x) => {
					return (
						Object.keys(data[x]).length !== 0 && (
							<TimelineContestTable
								club={club}
								data={data[x]}
								key={x}
								startOfEvent={timeline[x] || moment()}
								event={x}
							/>
						)
					);
				})}
			</Page>
		</Document>
	);
}
