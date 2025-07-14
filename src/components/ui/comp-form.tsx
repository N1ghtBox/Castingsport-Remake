import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	createComp,
	getCompetitionLogo,
	saveCompetitionLogo,
} from "@/utils/jsonUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Upload } from "antd";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Calendar } from "./calendar";
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
			required_error:'Logo jest wymagane'
		})
		,
	})
	.refine((data) => data.dateTo >= data.dateFrom, {
		message: "Data zakończenia nie może być wcześniej niż rozpoczęcie zawodów",
		path: ["dateTo"],
	});

type CompetitionFormProps = {
	callback?: (id: string) => void;
};

export default function CompetitionForm({ callback }: CompetitionFormProps) {
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
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			const id = await createComp(values);
			callback?.(id);
		} catch (ex) {
			toast.error("Tworzenie zawodów się nie powiodło");
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
							<FormItem>
								<FormLabel>Logo</FormLabel>
								<FormControl>
									<Upload
										{...field}
										fileList={[]}
										name="avatar"
										listType="picture-card"
										className="avatar-uploader"
										accept="image/*"
										maxCount={1}
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
										{logo ? <Image src={logo} /> : uploadButton}
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
		<div style={{ marginTop: 8 }}>Upload</div>
	</button>
);
