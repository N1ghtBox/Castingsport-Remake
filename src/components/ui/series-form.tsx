import { MenuListContext } from "@/BaseLayout"
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
import { createSeries } from "@/utils/seriesUtils"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker, Transfer } from "antd"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"


const formSchema = z.object({
    name: z.string().nonempty("Nazwa nie może być pusta"),
    competitionIds: z.array(z.string()),
    year: z.number()

})


type SeriesFormProps = {
    callback?: (id: string) => void
}

export default function SeriesForm({ callback }: SeriesFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { competitions } = React.useContext(MenuListContext)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            year: new Date().getFullYear(),
            competitionIds: []
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const id = await createSeries(values)
            callback?.(id)
        } catch (ex) {
            toast.error("Tworzenie cyklu się nie powiodło")
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
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rok</FormLabel>
                            <FormControl>
                                <DatePicker picker="year" onChange={(value) => {
                                    field.onChange(value.year())
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="competitionIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rok</FormLabel>
                            <FormControl>
                                <Transfer
                                    dataSource={competitions.map(x => ({ title: x.name, id: x.id }))}
                                    titles={['Zawody', 'Cykl']}
                                    targetKeys={field.value}
                                    onChange={(keys) => field.onChange(keys)}
                                    rowKey={(item) => item.id}
                                    render={(item) => item.title}
                                    oneWay
                                    style={{ marginBottom: 16 }}
                                />
                            </FormControl>
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