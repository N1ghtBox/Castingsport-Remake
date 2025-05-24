import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { CalendarIcon } from "lucide-react"
import { format, } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { pl } from 'date-fns/locale';
import { createComp } from "@/utils/jsonUtils"
import { useState } from "react"
import { toast } from "sonner"


const formSchema = z.object({
    name: z.string().nonempty("Nazwa nie może być pusta"),
    place: z.string().nonempty("Miejscowość nie może być pusta"),
    dateFrom: z.date({
        required_error: "Data rozpoczęcia jest wymagana",
    }),
    dateTo: z.date({
        required_error: "Data zakończenia jest wymagana",
    }),

})
    .refine((data) => data.dateTo > data.dateFrom, {
        message: "Data zakończenia nie może być wcześniej niż rozpoczęcie zawodów",
        path: ["dateTo"],
    })

type CompetitionFormProps = {
    callback?: (id: string) => void
}

export default function CompetitionForm({ callback }: CompetitionFormProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            place: "",
            dateFrom: undefined,
            dateTo: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const id = await createComp(values)
            callback?.(id)
        } catch (ex) {
            toast.error("Tworzenie zawodów się nie powiodło")
            console.error(ex);
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-100 space-y-4">
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
                        <FormItem >
                            <FormLabel>Miejscowość</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data rozpoczęcia</FormLabel>
                            <Popover>
                                <PopoverTrigger className="w-fit" >
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: pl })
                                            ) : (
                                                <span>Wybierz date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={pl}
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
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
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: pl })
                                            ) : (
                                                <span>Wybierz date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={pl}
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < form.getValues().dateFrom
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" loading={loading}>
                    Zapisz
                </Button>
            </form>
        </Form >
    )
}