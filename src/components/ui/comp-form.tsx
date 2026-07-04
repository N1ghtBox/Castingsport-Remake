import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Upload } from "antd";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Path } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
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
			name: z.string().nonempty(t("validation.nameRequired")),
			place: z.string().nonempty(t("validation.placeRequired")),
			dateFrom: z.date({ required_error: t("validation.dateFromRequired") }),
			dateTo: z.date({ required_error: t("validation.dateToRequired") }),
			logoUrl: z.string({ required_error: t("validation.logoRequired") }),
			mainJudge: z.string(),
			secondaryJudge: z.string(),
		})
		.refine((data) => data.dateTo >= data.dateFrom, {
			message: t("validation.dateToBeforeFrom"),
			path: ["dateTo"],
		});
}

type CompetitionFormProps = {
	callback: (id: string) => void;
	editCallback: () => void;
	editId: string | undefined;
};

export default function CompetitionForm({
	callback,
	editId,
	editCallback,
}: CompetitionFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [logo, setLogo] = useState<string>();
	const { t } = useTranslation();

	const formSchema = useMemo(() => createFormSchema(t), [t]);

	const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			place: "",
			dateFrom: undefined,
			dateTo: undefined,
			logoUrl: undefined,
			mainJudge: "",
			secondaryJudge: "",
		},
	});

	useEffect(() => {
		async function fetchComp() {
			if (form && editId) {
				const comp = await getCompetitionInfo(editId);

				if (!comp) return;

				const formControls = Object.keys(form.getValues());
				Object.entries(comp).forEach(async ([key, value]) => {
					if (!formControls.includes(key)) return;
					if (key.includes("date"))
						form.setValue(
							key as Path<z.infer<typeof formSchema>>,
							new Date(value as unknown as string),
						);
					else if (key === "logoUrl") {
						const logo = await getCompetitionLogo(value.toString());
						form.setValue("logoUrl", value.toString());
						setLogo(logo);
					} else form.setValue(key as Path<z.infer<typeof formSchema>>, value as any);
				});
			}
		}
		fetchComp();
	}, [editId, form]);

	async function onSubmit(
		values: z.infer<ReturnType<typeof createFormSchema>>,
	) {
		setLoading(true);
		try {
			if (editId !== undefined) {
				await updateCompInfo(editId, values);
				editCallback();
			} else {
				const id = await createComp(values);
				callback(id);
			}
		} catch (ex) {
			if (editId !== undefined) toast.error("Edycja zawodów się nie powiodło");
			else toast.error("Tworzenie zawodów się nie powiodło");
			LoggingProvider.LogException("Competition form submission failed", ex);
		}
		setLoading(false);
	}

	const uploadButton = (
		<button
			style={{ border: 0, background: "none" }}
			className="flex items-center flex-col"
			type="button">
			<Plus />
			<div style={{ marginTop: 8 }}>{t("compForm.upload")}</div>
		</button>
	);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-100 space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("compForm.competitionName")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="place"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("compForm.place")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="mainJudge"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{t("compForm.mainJudge")}</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="secondaryJudge"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{t("compForm.secondaryJudge")}</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-3 w-[60%]">
						<FormField
							control={form.control}
							name="dateFrom"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("compForm.dateFrom")}</FormLabel>
									<DatePicker
										maxDate={dayjs(form.getValues().dateTo) || undefined}
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
										{...field}
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
