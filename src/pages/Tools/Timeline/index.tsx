import { Print } from "@mui/icons-material";
import { Document, Page, StyleSheet, usePDF } from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import moment, { type Moment } from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { v7 as uuid } from "uuid";
import usePDFActions from "@/hooks/use-pdf-actions";
import {
	generateTimeline,
	generateTimelineWithConfigs,
	getEventOrder,
} from "@/lib/timelineUtils";
import { Combobox } from "@/pages/Combobox";
import PrintHeader from "@/pages/PrintHeader";
import { Button } from "@/pages/ui/button";
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
	const [refreshId, setRefreshId] = useState<string>(uuid());

	const timelineData = React.useMemo(() => {
		const generateTimelineForEvent = generateTimelineWithConfigs(
			competitionContext.compInfo.platformConfig,
			competitionContext.compInfo.orderConfig,
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

		setRefreshId(uuid());
		return data;
	}, [
		competitionContext.contestants,
		competitionContext.compInfo.platformConfig,
		competitionContext.compInfo.orderConfig,
	]);

	const timeline = useMemo(() => {
		const startDate = moment(competitionContext.compInfo.dateFrom);

		setRefreshId(uuid());
		return generateTimeline(
			startDate,
			timelineData,
			competitionContext.compInfo.timeConfig,
			competitionContext.compInfo.orderConfig,
		);
	}, [
		timelineData,
		competitionContext.compInfo.timeConfig,
		competitionContext.compInfo.dateFrom,
		competitionContext.compInfo.orderConfig,
	]);

	const Event_Order = useMemo(() => {
		setRefreshId(uuid());
		return getEventOrder(competitionContext.compInfo.orderConfig);
	}, [competitionContext.compInfo.orderConfig]);

	const [instance, updateInstance] = usePDF({
		document: (
			<TimelineDocument
				comp={competitionContext.compInfo}
				data={timelineData}
				club={club}
				timeline={timeline}
				eventOrder={Event_Order}
				refreshId={refreshId}
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
				eventOrder={Event_Order}
				refreshId={refreshId}
			/>,
		);
	}, [
		competitionContext.compInfo,
		updateInstance,
		timelineData,
		timeline,
		club,
		Event_Order,
		refreshId,
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
	eventOrder: Contests[];
	refreshId: string;
};

function TimelineDocument({
	comp,
	data,
	timeline,
	club,
	eventOrder,
	refreshId,
}: DocumentProps) {
	return (
		<Document
			title="Contest Results"
			creator="Castingsport Dawid Witczak">
			<Page
				size="A4"
				key={refreshId}
				style={styles.page}>
				<PrintHeader comp={comp} />

				{Array.from(eventOrder.slice(0, 9)).map((x) => {
					return (
						Object.keys(data[x]).length !== 0 && (
							<TimelineContestTable
								club={club}
								data={data[x]}
								key={`${refreshId}-x`}
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
