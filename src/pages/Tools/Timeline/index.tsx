import { Document, Page, usePDF } from "@react-pdf/renderer";
import moment, { type Moment } from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { v7 as uuid } from "uuid";
import { Combobox } from "@/components/Combobox";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PdfConsts from "@/consts/PdfConsts";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import {
	generateBaseTimeline,
	generateTimeline,
	generateTimelineWithConfigs,
	getEventOrder,
} from "@/lib/timelineUtils";
import PrintHeader from "@/pages/PrintHeader";
import type Competition from "@/types/Competition";
import type { Contests } from "@/types/Contestant";
import type { TimelineData } from "@/types/TimelineData";
import { GetAllUniqueClubs } from "@/utils/convertUtils";
import OverwriteSettings from "./OverwriteSettings/OverwriteSettings";
import TimelineContestTable from "./Table/TimelineContestTable";

const TimelineGenerate = () => {
	const { compInfo, contestants } = useCompetitionContext();
	const [club, setClub] = useState<string>();
	const [refreshId, setRefreshId] = useState<string>(uuid());

	const timelineData = React.useMemo(() => {
		const generateTimelineForEvent = generateTimelineWithConfigs(
			compInfo.platformConfig,
			compInfo.orderConfig,
		);

		const data = generateBaseTimeline(generateTimelineForEvent, contestants);

		setRefreshId(uuid());
		return data;
	}, [contestants, compInfo.platformConfig, compInfo.orderConfig]);

	const timeline = useMemo(() => {
		const startDate = moment(compInfo.dateFrom);

		setRefreshId(uuid());
		return generateTimeline(
			startDate,
			timelineData,
			compInfo.timeConfig,
			compInfo.orderConfig,
		);
	}, [
		timelineData,
		compInfo.timeConfig,
		compInfo.dateFrom,
		compInfo.orderConfig,
	]);

	const Event_Order = useMemo(() => {
		setRefreshId(uuid());
		return getEventOrder(compInfo.orderConfig);
	}, [compInfo.orderConfig]);

	const [instance, updateInstance] = usePDF({
		document: (
			<TimelineDocument
				comp={compInfo}
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
				comp={compInfo}
				data={timelineData}
				club={club}
				timeline={timeline}
				eventOrder={Event_Order}
				refreshId={refreshId}
			/>,
		);
	}, [
		compInfo,
		updateInstance,
		timelineData,
		timeline,
		club,
		Event_Order,
		refreshId,
	]);

	return (
		<>
			<PrintActionButtons
				printName={`Rozpiska-${compInfo.name}.pdf`}
				instance={instance}
				hasCategoryCombobox={false}
				additionalActions={
					<>
						<Combobox
							placeholder="Wybierz okręg..."
							onChange={(value) => setClub(value)}
							value={club}
							options={GetAllUniqueClubs(contestants).map((x) => ({
								label: x,
								value: x,
							}))}
							allowDeselect={true}
						/>
						<OverwriteSettings />
					</>
				}
			/>
			<PrintDisplay
				instance={instance}
				loadingMessage="Generowanie rozpiski"
			/>
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
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			<Page
				size="A4"
				key={refreshId}
				style={PdfConsts.styles.page}>
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
