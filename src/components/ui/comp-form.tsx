import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Upload } from "antd";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { Flag, Globe, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Control, DefaultValues } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import z from "zod";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import type { CompetitionExportData } from "@/types/JsonData";
import { sanitizeName } from "@/utils/inputUtils";
import {
	createComp,
	getCompetitionInfo,
	getCompetitionLogo,
	saveCompetitionLogo,
	updateCompInfo,
} from "@/utils/jsonUtils";
import { Button } from "./button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";

function createFormSchema(t: TFunction) {
	return z
		.object({
			name: z
				.string()
				.transform(sanitizeName)
				.refine((v) => v.length > 0, t("validation.nameRequired")),
			place: z.string().nonempty(t("validation.placeRequired")),
			dateFrom: z.date({ required_error: t("validation.dateFromRequired") }),
			dateTo: z.date({ required_error: t("validation.dateToRequired") }),
			logoUrl: z.string({ required_error: t("validation.logoRequired") }),
			mainJudge: z.string(),
			secondaryJudge: z.string(),
			isInternational: z.boolean().optional(),
			subcategories: z
				.array(
					z.object({
						id: z.string(),
						name: z.string().nonempty(t("validation.nameRequired")),
					}),
				)
				.optional(),
		})
		.refine((data) => data.dateTo >= data.dateFrom, {
			message: t("validation.dateToBeforeFrom"),
			path: ["dateTo"],
		});
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

const emptyCompetition: DefaultValues<FormValues> = {
	name: "",
	place: "",
	dateFrom: undefined,
	dateTo: undefined,
	logoUrl: undefined,
	mainJudge: "",
	secondaryJudge: "",
	isInternational: false,
	subcategories: [],
};

type FieldProps<TName extends keyof FormValues> = {
	control: Control<FormValues>;
	name: TName;
	label: string;
	className?: string;
};

function TextField({
	control,
	name,
	label,
	className,
}: FieldProps<"name" | "place" | "mainJudge" | "secondaryJudge">) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function DateField({
	control,
	name,
	label,
	minDate,
	maxDate,
}: FieldProps<"dateFrom" | "dateTo"> & { minDate?: Date; maxDate?: Date }) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>{label}</FormLabel>
					<DatePicker
						minDate={minDate ? dayjs(minDate) : undefined}
						maxDate={maxDate ? dayjs(maxDate) : undefined}
						value={field.value ? dayjs(field.value) : undefined}
						onChange={(date) => field.onChange(date.toDate())}
					/>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function LogoField({ control }: { control: Control<FormValues> }) {
	const { t } = useTranslation();
	const [logo, setLogo] = useState<string>();
	const logoUrl = useWatch({ control, name: "logoUrl" });

	// The preview follows the stored path, so loading a competition needs no extra wiring.
	useEffect(() => {
		if (!logoUrl) {
			setLogo(undefined);
			return;
		}
		getCompetitionLogo(logoUrl).then(setLogo);
	}, [logoUrl]);

	return (
		<FormField
			control={control}
			name="logoUrl"
			render={({ field }) => (
				<FormItem className="max-w-[100px]">
					<FormLabel>{t("compForm.logo")}</FormLabel>
					<FormControl>
						<Upload
							{...field}
							fileList={logo ? [{ uid: logo, url: logo, name: logo }] : []}
							name="avatar"
							listType="picture-card"
							className="avatar-uploader"
							accept="image/*"
							onRemove={() => field.onChange(undefined)}
							customRequest={(opt) => {
								opt.onSuccess?.({});
								field.onChange(opt.action);
							}}
							onChange={(info) => {
								if (info.file.status === "done") field.onChange(info.file.url);
							}}
							action={async (file) => {
								const array = await file.arrayBuffer();
								return await saveCompetitionLogo(
									new Uint8Array(array),
									file.name,
								);
							}}>
							{logo ? null : (
								<button
									style={{ border: 0, background: "none" }}
									className="flex items-center flex-col"
									type="button">
									<Plus />
									<div style={{ marginTop: 8 }}>{t("compForm.upload")}</div>
								</button>
							)}
						</Upload>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function SubcategoriesField({ control }: { control: Control<FormValues> }) {
	const { t } = useTranslation();
	const subcategories = useFieldArray({ control, name: "subcategories" });

	return (
		<div className="flex flex-col gap-2">
			<FormLabel>{t("compForm.subcategories")}</FormLabel>
			{subcategories.fields.map((item, index) => (
				<FormField
					key={item.id}
					control={control}
					name={`subcategories.${index}.name`}
					render={({ field }) => (
						<FormItem>
							<div className="flex gap-2 items-center">
								<FormControl>
									<Input
										{...field}
										placeholder={t("subcategory.name")}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									title={t("common.delete")}
									onClick={() => subcategories.remove(index)}>
									<Trash2 />
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}
			<Button
				type="button"
				variant="outline"
				className="self-start"
				onClick={() => subcategories.append({ id: uuid(), name: "" })}>
				<Plus />
				{t("subcategory.add")}
			</Button>
		</div>
	);
}

type CompetitionFormProps = {
	callback: (id: string) => void;
	editCallback: () => void;
	editId: string | undefined;
	// Contestants and teams from an imported competition file, saved into the newly created competition.
	importData?: CompetitionExportData;
};

export default function CompetitionForm({
	callback,
	editId,
	editCallback,
	importData,
}: CompetitionFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const { t } = useTranslation();

	const formSchema = useMemo(() => createFormSchema(t), [t]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: emptyCompetition,
	});

	const { control } = form;
	const { errors } = form.formState;
	// A field that fails validation on a hidden tab would otherwise block submit invisibly.
	const hasGeneralErrors = Object.keys(errors).some(
		(field) => field !== "subcategories",
	);
	const [dateFrom, dateTo] = useWatch({
		control,
		name: ["dateFrom", "dateTo"],
	});

	useEffect(() => {
		if (!editId) return;
		getCompetitionInfo(editId).then((comp) => {
			if (!comp) return;
			form.reset({
				...comp,
				dateFrom: new Date(comp.dateFrom),
				dateTo: new Date(comp.dateTo),
				isInternational: comp.isInternational ?? false,
				subcategories: comp.subcategories ?? [],
			});
		});
	}, [editId, form]);

	useEffect(() => {
		if (!importData) return;
		const comp = importData.competition;

		form.setValue("name", comp?.name || importData.name);
		if (!comp) return;
		form.setValue("place", comp.place ?? "");
		form.setValue("mainJudge", comp.mainJudge ?? "");
		form.setValue("secondaryJudge", comp.secondaryJudge ?? "");
		if (comp.dateFrom) form.setValue("dateFrom", new Date(comp.dateFrom));
		if (comp.dateTo) form.setValue("dateTo", new Date(comp.dateTo));
	}, [importData, form]);

	async function onSubmit(
		values: z.infer<ReturnType<typeof createFormSchema>>,
	) {
		setLoading(true);
		try {
			if (editId !== undefined) {
				await updateCompInfo(editId, values);
				editCallback();
			} else {
				const id = await createComp(values, importData);
				callback(id);
			}
		} catch (ex) {
			toast.error(
				editId !== undefined
					? t("compForm.editError")
					: t("compForm.createError"),
			);
			LoggingProvider.LogException("Competition form submission failed", ex);
		}
		setLoading(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-100 space-y-4">
				<Tabs
					defaultValue="general"
					className="min-h-[22rem]">
					<TabsList variant="line">
						<TabsTrigger
							value="general"
							className={hasGeneralErrors ? "text-destructive" : ""}>
							{t("compForm.tabs.general")}
						</TabsTrigger>
						<TabsTrigger
							value="subcategories"
							className={errors.subcategories ? "text-destructive" : ""}>
							{t("compForm.tabs.subcategories")}
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="general"
						className="space-y-4">
						<TextField
							control={control}
							name="name"
							label={t("compForm.competitionName")}
						/>
						<TextField
							control={control}
							name="place"
							label={t("compForm.place")}
						/>
						<div className="flex gap-2">
							<TextField
								control={control}
								name="mainJudge"
								label={t("compForm.mainJudge")}
								className="w-1/2"
							/>
							<TextField
								control={control}
								name="secondaryJudge"
								label={t("compForm.secondaryJudge")}
								className="w-1/2"
							/>
						</div>
						<div className="flex justify-between items-center">
							<div className="flex flex-col gap-3 w-[60%]">
								<DateField
									control={control}
									name="dateFrom"
									label={t("compForm.dateFrom")}
									maxDate={dateTo}
								/>
								<DateField
									control={control}
									name="dateTo"
									label={t("compForm.dateTo")}
									minDate={dateFrom}
								/>
							</div>
							<LogoField control={control} />
						</div>

						<FormField
							control={control}
							name="isInternational"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("compForm.dateFrom")}{" "}
										{form.getValues().dateTo?.toDateString()}
									</FormLabel>
									<DatePicker
										maxDate={
											form.getValues().dateTo
												? dayjs(form.getValues().dateTo)
												: undefined
										}
										value={field.value ? dayjs(field.value) : undefined}
										onChange={(date) => {
											field.onChange(date.toDate());
										}}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dateTo"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>{t("compForm.dateTo")}</FormLabel>
									<DatePicker
										minDate={dayjs(form.getValues().dateFrom) || undefined}
										value={field.value ? dayjs(field.value) : undefined}
										onChange={(date) => {
											field.onChange(date.toDate());
										}}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="logoUrl"
						render={({ field }) => (
							<FormItem className="max-w-[100px]">
								<FormLabel>{t("compForm.logo")}</FormLabel>
								<FormControl>
									<Upload
										fileList={
											logo ? [{ uid: logo, url: logo, name: logo }] : []
										}
										name="avatar"
										listType="picture-card"
										className="avatar-uploader"
										accept="image/*"
										onRemove={() => {
											setLogo(undefined);
											field.onChange(undefined);
										}}
										customRequest={async (opt) => {
											opt.onSuccess?.({});
											field.onChange(opt.action);
											const logoUrl = await getCompetitionLogo(opt.action);
											setLogo(logoUrl);
										}}
										onChange={(info) => {
											if (info.file.status === "done") {
												field.onChange(info.file.url);
											}
										}}
										action={async (file) => {
											const array = await file.arrayBuffer();
											return await saveCompetitionLogo(
												new Uint8Array(array),
												file.name,
											);
										}}>
										{logo ? null : uploadButton}
									</Upload>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					loading={loading}>
					{t("common.save")}
				</Button>
			</form>
		</Form>
	);
}
