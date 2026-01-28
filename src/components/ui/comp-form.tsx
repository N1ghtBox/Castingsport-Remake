import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormLabel } from "@mui/material";
import { Upload } from "antd";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { cn } from "@/lib/utils";
import {
	createComp,
	getCompetitionInfo,
	getCompetitionLogo,
	saveCompetitionLogo,
	updateCompInfo,
} from "@/utils/jsonUtils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { FormField, FormItem, FormMessage } from "./form";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const formSchema = z
	.object({
		name: z.string().nonempty("Nazwa nie może być pusta"),
		place: z.string().nonempty("Miejscowość nie może być pusta"),
		dateFrom: z.date({
			required_error: "Data rozpoczęcia jest wymagana",
		}),
		dateTo: z.date({
			required_error: "Data zakończenia jest wymagana",
		}),
		logoUrl: z.string({
			required_error: "Logo zawodów jest wymagane",
		}),
		mainJudge: z.string(),
		secondaryJudge: z.string(),
	})
	.refine((data) => data.dateTo >= data.dateFrom, {
		message: "Data zakończenia nie może być wcześniej niż rozpoczęcie zawodów",
		path: ["dateTo"],
	});

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

	const form = useForm<z.infer<typeof formSchema>>({
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
						form.setValue(key as any, new Date(value as any));
					else if (key === "logoUrl") {
						const logo = await getCompetitionLogo(value.toString());
						form.setValue("logoUrl", value.toString());
						setLogo(logo);
					} else form.setValue(key as any, value);
				});
			}
		}
		fetchComp();
	}, [editId, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
			console.error(ex);
		}
		setLoading(false);
	}

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
							<FormLabel>Nazwa zawodów</FormLabel>
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
							<FormLabel>Miejscowość</FormLabel>
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
								<FormLabel>Sędzia główny</FormLabel>
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
								<FormLabel>Sędzia sekretarz</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-3">
						<FormField
							control={form.control}
							name="dateFrom"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Data rozpoczęcia</FormLabel>
									<Popover>
										<PopoverTrigger className="w-fit">
											<FormControl>
												<Button
													type="button"
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}>
													{field.value ? (
														format(field.value, "PPP", { locale: pl })
													) : (
														<span>Wybierz date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start">
											<Calendar
												locale={pl}
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date > form.getValues().dateTo}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dateTo"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Data zakończenia</FormLabel>
									<Popover>
										<PopoverTrigger className="w-fit">
											<FormControl>
												<Button
													type="button"
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}>
													{field.value ? (
														format(field.value, "PPP", { locale: pl })
													) : (
														<span>Wybierz date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start">
											<Calendar
												locale={pl}
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date < form.getValues().dateFrom}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
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
								<FormLabel>Logo</FormLabel>
								<FormControl>
									<Upload
										{...field}
										fileList={
											logo
												? [
													{
														uid: logo,
														url: logo,
														name: logo,
													},
												]
												: []
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
					Zapisz
				</Button>
			</form>
		</Form>
	);
}
const uploadButton = (
	<button
		style={{ border: 0, background: "none" }}
		className="flex items-center flex-col"
		type="button">
		<Plus />
		<div style={{ marginTop: 8 }}>Załaduj</div>
	</button>
);
