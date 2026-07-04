import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Select, Transfer } from "antd";
import type { TFunction } from "i18next";
import { useEffect, useMemo, useState } from "react";
import type { Path } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import { useMenuContext } from "@/context/menu/MenuContext";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import { SeriesTypes } from "@/types/Series";
import { createSeries, getSerieData, updateSeries } from "@/utils/seriesUtils";
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
	return z.object({
		name: z.string().nonempty(t("validation.nameRequired")),
		competitionIds: z.array(z.string()),
		year: z.number(),
		type: z.nativeEnum(SeriesTypes),
	});
}

type SeriesFormProps = {
	callback?: (id: string) => void;
	editCallback: () => void;
	editId: string | undefined;
};

export default function SeriesForm({
	callback,
	editId,
	editCallback,
}: SeriesFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const { competitions } = useMenuContext();
	const { t } = useTranslation();

	const formSchema = useMemo(() => createFormSchema(t), [t]);

	const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			year: new Date().getFullYear(),
			competitionIds: [],
			type: "Puchar",
		},
	});

	useEffect(() => {
		async function fetchComp() {
			if (form && editId) {
				const comp = await getSerieData(editId);

				if (!comp) return;

				const formControls = Object.keys(form.getValues());
				Object.entries(comp).forEach(async ([key, value]) => {
					if (!formControls.includes(key)) return;
					form.setValue(key as Path<z.infer<typeof formSchema>>, value);
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
				await updateSeries(editId, values);
				editCallback();
			} else {
				const id = await createSeries(values);
				callback?.(id);
			}
		} catch (ex) {
			toast.error(t("seriesForm.createError"));
			LoggingProvider.LogException(
				"Error during updating/creating series.",
				ex,
			);
		}
		setLoading(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("seriesForm.name")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-8">
					<FormField
						control={form.control}
						name="year"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{t("seriesForm.year")}</FormLabel>
								<FormControl>
									<DatePicker
										picker="year"
										onChange={(value) => {
											field.onChange(value.year());
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{t("seriesForm.summaryType")}</FormLabel>
								<Select
									placeholder={t("seriesForm.selectType")}
									getPopupContainer={(triggerNode) =>
										triggerNode.parentElement || document.body
									}
									value={field.value}
									className="w-full z-100"
									options={[
										{ value: SeriesTypes.puchar, label: SeriesTypes.puchar },
										{ value: SeriesTypes.tury, label: SeriesTypes.tury },
									]}
									onChange={(value) => {
										field.onChange(value);
									}}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="competitionIds"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>{t("seriesForm.competitionsInCycle")}</FormLabel>
							<FormControl>
								<Transfer
									showSearch
									dataSource={competitions.map((x) => ({
										title: x.name,
										id: x.id,
									}))}
									titles={[t("seriesForm.competitions"), t("seriesForm.cycle")]}
									targetKeys={field.value}
									onChange={(keys) => field.onChange(keys)}
									rowKey={(item) => item.id}
									render={(item) => item.title}
									listStyle={{ width: "250px", height: "300px" }}
									locale={{
										itemUnit: t("seriesForm.competitions"),
										itemsUnit: t("seriesForm.competitions"),
									}}
									filterOption={(inputValue: string, option) =>
										option.title.includes(inputValue)
									}
									style={{ marginBottom: 16 }}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					loading={loading}>
					{t("common.save")}
				</Button>
			</form>
		</Form>
	);
}
