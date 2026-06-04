import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { GripVertical } from "lucide-react";
import moment, { type Moment } from "moment";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { EventDurationConfig, OrderConfig, PlatformConfig, TimeConfig } from "@/types/Competition";
import { DEFAULT_EVENT_TIME_CONFIG } from "@/lib/timelineUtils";
import { useContestName } from "@/i18n/contestNames";
import { type Contests } from "@/types/Contestant";

type CombinedFormProps = {
	orderConfig: OrderConfig;
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	eventDurationConfig: EventDurationConfig;
	eventCooldown: number;
	updateOrder: (contest: Contests, slot: number) => void;
	updatePlatform: (contest: Contests, value: number) => void;
	updateTime: (contest: Contests, value?: Moment) => void;
	updateEventDuration: (contest: Contests, value: number) => void;
	updateCooldown: (value: number) => void;
};

type SortableRowProps = {
	slot: number;
	contest: Contests;
	contestName: string;
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	eventDurationConfig: EventDurationConfig;
	dateFrom: Date;
	dateTo: Date;
	updatePlatform: (contest: Contests, value: number) => void;
	updateTime: (contest: Contests, value?: Moment) => void;
	updateEventDuration: (contest: Contests, value: number) => void;
};

const SortableRow: React.FC<SortableRowProps> = ({
	slot,
	contest,
	contestName,
	platformConfig,
	timeConfig,
	eventDurationConfig,
	dateFrom,
	dateTo,
	updatePlatform,
	updateTime,
	updateEventDuration,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: contest });

	const style = {
		transform: isDragging
			? `${CSS.Transform.toString(transform)} scale(1.02)`
			: CSS.Transform.toString(transform),
		transition,
		boxShadow: isDragging ? "0 8px 32px rgba(0,0,0,0.15)" : undefined,
		zIndex: isDragging ? 1 : undefined,
		position: isDragging ? ("relative" as const) : undefined,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center gap-2 min-h-10 rounded-md">
			<button
				type="button"
				className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
				{...attributes}
				{...listeners}>
				<GripVertical className="h-4 w-4" />
			</button>
			<span className="w-5 shrink-0 text-center text-sm text-muted-foreground">
				{slot}
			</span>
			<span className="flex-1 text-sm truncate">{contestName}</span>
			<Input
				className="w-16 text-center"
				type="number"
				min={0}
				value={platformConfig[contest] ?? 0}
				onChange={(e) => updatePlatform(contest, Math.max(0, Number(e.target.value)))}
			/>
			<Input
				className="w-16 text-center"
				type="number"
				min={1}
				value={eventDurationConfig[contest] ?? DEFAULT_EVENT_TIME_CONFIG[contest]}
				onChange={(e) => updateEventDuration(contest, Math.max(1, Number(e.target.value)))}
			/>
			<DatePicker
				style={{ width: 160 }}
				placeholder="Czas startu"
				showTime={{ minuteStep: 30, format: "HH:mm" }}
				minDate={dayjs(dateFrom)}
				maxDate={dayjs(dateTo)}
				onChange={(value) =>
					updateTime(contest, value ? moment(value.toISOString()) : undefined)
				}
				format={{ format: "DD MMM HH:mm" }}
				value={
					timeConfig[contest]
						? dayjs(moment(timeConfig[contest]).toISOString())
						: undefined
				}
			/>
		</div>
	);
};

const CombinedForm: React.FC<CombinedFormProps> = ({
	orderConfig,
	platformConfig,
	timeConfig,
	eventDurationConfig,
	eventCooldown,
	updateOrder,
	updatePlatform,
	updateTime,
	updateEventDuration,
	updateCooldown,
}) => {
	const { compInfo } = useCompetitionContext();
	const { t } = useTranslation();
	const getContestName = useContestName();

	const fromConfig = useMemo(
		() => Array.from({ length: 9 }, (_, i) => (orderConfig?.[i + 1] ?? i + 1) as Contests),
		[orderConfig],
	);

	const [contestOrder, setContestOrder] = useState<Contests[]>(fromConfig);

	useEffect(() => {
		setContestOrder(fromConfig);
	}, [fromConfig]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = contestOrder.indexOf(active.id as Contests);
		const newIndex = contestOrder.indexOf(over.id as Contests);
		const newOrder = arrayMove(contestOrder, oldIndex, newIndex);

		setContestOrder(newOrder);
		newOrder.forEach((contest, i) => updateOrder(contest, i + 1));
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
				<span className="w-4 shrink-0" />
				<span className="w-5 shrink-0 text-center">#</span>
				<span className="flex-1">{t("nav.contests")}</span>
				<span className="w-16 text-center">{t("overwriteSettings.platformCol")}</span>
				<span className="w-16 text-center">{t("overwriteSettings.minPerPerson")}</span>
				<span className="w-40">{t("overwriteSettings.startTime")}</span>
			</div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
				onDragEnd={handleDragEnd}>
				<SortableContext
					items={contestOrder}
					strategy={verticalListSortingStrategy}>
					{contestOrder.map((contest, i) => (
						<SortableRow
							key={contest}
							slot={i + 1}
							contest={contest}
							contestName={getContestName(contest)}
							platformConfig={platformConfig}
							timeConfig={timeConfig}
							eventDurationConfig={eventDurationConfig}
							dateFrom={compInfo.dateFrom}
							dateTo={compInfo.dateTo}
							updatePlatform={updatePlatform}
							updateTime={updateTime}
							updateEventDuration={updateEventDuration}
						/>
					))}
				</SortableContext>
			</DndContext>
			<div className="flex items-center gap-2 px-1 pt-2 border-t mt-1">
				<span className="flex-1 text-sm text-muted-foreground">{t("overwriteSettings.breakBetween")}</span>
				<Input
					className="w-16 text-center"
					type="number"
					min={0}
					value={eventCooldown}
					onChange={(e) => updateCooldown(Math.max(0, Number(e.target.value)))}
				/>
				<span className="text-sm text-muted-foreground">{t("overwriteSettings.breakUnit")}</span>
			</div>
		</div>
	);
};

export default CombinedForm;
