import { DatePicker, type DatePickerProps } from "antd";
import dayjs from "dayjs";
import moment, { type Moment } from "moment";
import type React from "react";
import { useContext } from "react";
import { Label } from "@/components/ui/label";
import { CompetitonContext } from "@/types/CompetitionContext";
import { ContestNames, type Contests } from "@/types/Contestant";
import type TimeConfig from "@/types/TimeConfig";

type TimeFormProps = {
	config: TimeConfig;
	updateConfig: (event: Contests, value?: Moment) => void;
};

const TimeForm: React.FC<TimeFormProps> = ({ config, updateConfig }) => {
	const competitionContext = useContext(CompetitonContext);

	return Array.from(ContestNames)
		.sort((a, b) => a[0].valueOf() - b[0].valueOf())
		.map(([event, name]) => {
			return (
				<div
					className="flex w-full max-w-sm items-center gap-3 py-1 min-h-[45px]"
					key={event}>
					<Label
						htmlFor="email"
						className="w-[60%]">
						{name}
					</Label>
					<DatePicker
						required
						placeholder="Nadpisz czas startu"
						showTime={{ minuteStep: 30, format: "HH:mm" }}
						minDate={dayjs(competitionContext.compInfo.dateFrom)}
						maxDate={dayjs(competitionContext.compInfo.dateTo)}
						onChange={(value) => {
							updateConfig(
								event,
								value ? moment(value.toISOString()) : undefined,
							);
						}}
						format={{ format: "DD MMM YYYY HH:mm" }}
						value={
							config[event]
								? dayjs(moment(config[event]).toISOString())
								: undefined
						}
					/>
				</div>
			);
		});
};

export default TimeForm;
