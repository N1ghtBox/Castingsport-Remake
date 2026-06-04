import { Document, Page, StyleSheet, usePDF } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "@/components/Combobox";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PdfConsts from "@/consts/PdfConsts";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestName } from "@/i18n/contestNames";
import { generateTimelineWithConfigs } from "@/lib/timelineUtils";
import { ContestNames, Contests } from "@/types/Contestant";
import type { TimelineContestant } from "@/types/TimelineData";
import { TypeOfContest } from "@/utils/contestUtils";
import { ByDistanceContest } from "@/utils/filterUtils";
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
	const [event, setEvent] = useState<Contests>(Contests.Distance);
	const { compInfo, contestants } = useCompetitionContext();
	const { t } = useTranslation();
	const getContestName = useContestName();

	const contestName = getContestName(event);
	const contestLabel = t("print.contest");
	const platformLabel = t("print.platform");
	const contestantLabel = t("print.contestant");
	const castLabel = t("table.cast");
	const signatureLabel = t("print.signature");

	const distanceData = React.useMemo(() => {
		const generateTimelineForEvent = generateTimelineWithConfigs(
			compInfo.platformConfig,
			compInfo.orderConfig,
		);

		return generateTimelineForEvent(contestants, event);
	}, [contestants, compInfo.platformConfig, compInfo.orderConfig, event]);

	const castCount = TypeOfContest(event) === "single" ? 3 : 2;

	const pdfLabels = { contestName, contestLabel, platformLabel, contestantLabel, castLabel, signatureLabel };

	const [instance, updateInstance] = usePDF({
		document: (
			<TimelineDocument
				data={distanceData}
				platfromCount={compInfo.platformConfig[event]}
				event={event}
				castCount={castCount}
				{...pdfLabels}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<TimelineDocument
				data={distanceData}
				platfromCount={compInfo.platformConfig[event]}
				event={event}
				castCount={castCount}
				{...pdfLabels}
			/>,
		);
	}, [updateInstance, distanceData, compInfo.platformConfig, event, castCount, contestName, contestLabel, platformLabel, contestantLabel, castLabel, signatureLabel]);

	const comboboxOptions = [...ContestNames.entries()]
		.filter((x) => ByDistanceContest(x[0]))
		.map((x) => ({ label: getContestName(x[0]), value: x[0].toString() }));

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`Rozpiska-${compInfo.name}.pdf`}
				additionalActions={
					<Combobox
						onChange={(val) => setEvent(Number(val))}
						value={event.toString()}
						options={comboboxOptions}
					/>
				}
			/>

			<PrintDisplay instance={instance} />
		</>
	);
};

export default ScoreGenerate;

type DocumentProps = {
	data: Record<number, TimelineContestant[]>;
	platfromCount: number;
	event: Contests;
	castCount: number;
	contestName: string;
	contestLabel: string;
	platformLabel: string;
	contestantLabel: string;
	castLabel: string;
	signatureLabel: string;
};

function TimelineDocument({
	data,
	platfromCount,
	event,
	castCount,
	contestName,
	contestLabel,
	platformLabel,
	contestantLabel,
	castLabel,
	signatureLabel,
}: DocumentProps) {
	return (
		<Document
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			{Array.from({ length: platfromCount }).map((_, i) => {
				return (
					<Page
						size="A4"
						style={styles.page}
						// biome-ignore lint/suspicious/noArrayIndexKey: Todo
						key={i}>
						<ScoreTablePlatform
							cont={data[i + 1]}
							number={i + 1}
							event={event}
							castCount={castCount}
							contestName={contestName}
							contestLabel={contestLabel}
							platformLabel={platformLabel}
							contestantLabel={contestantLabel}
							castLabel={castLabel}
							signatureLabel={signatureLabel}
						/>
					</Page>
				);
			})}
		</Document>
	);
}
