import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { TrophyIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { ResultRow } from "@/pages/Print/ContestPrint/ContestResults";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ButtonProps = {
    callback: (count: number | null) => void;
    id: string;
    results: ResultRow[];
}




const useFinalsButton = (id: string, results: ResultRow[]) => {
    const [finalCount, setFinalCount] = useState<number | null>(null);

    return {
        count: finalCount,
        FinalsButton: () => <FinalsButton
            callback={(count) => setFinalCount(count)}
            id={id}
            results={results} />,
    };
}

const FinalsButton = ({ callback, id, results }: ButtonProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [addResults, setAddResults] = useState(false);

    const formSchema = z.object({
        count: z.number().min(2, "Liczba zawodników musi być większa niż 1").optional(),
        results: z.array(z.object({
            number: z.string(),
            result: z.number().min(0, "Wynik nie może być mniejszy niż 0")
                .max(100, "Wynik nie może być większy niż 100")
        })),
    }).refine((data) => (data.count || 0) <= results.length, {
        message: "Liczba zawodników w finale nie może być większa niż całkowita liczba zawodników",
        path: ["count"],
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            count: undefined,
            results: []
        },

    })

    const count = useWatch({
        control: form.control,
        name: "count",
        defaultValue: undefined,
    });

    useEffect(() => {
        const storedCount = window.localStorage.getItem(`finals-${id}`);
        if (storedCount && !form.getValues("count")) {
            const count = Number.parseInt(storedCount);
            if (!Number.isNaN(count)) {
                form.setValue("count", count);
            }
        }

    }, [form, id]);

    const submit = (values: z.infer<typeof formSchema>) => {
        setOpenModal(false);
        callback(values.count || null);
        window.localStorage.setItem(`finals-${id}`, values.count?.toString() || '');
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal} >
            <DialogTrigger asChild>
                <Button
                    className="flex items-center gap-2"
                >
                    <TrophyIcon />
                    Finały
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tworzenie finałów</DialogTitle>
                    <DialogDescription>
                        Wprowadź liczbę zawodników, którzy wezmą udział w finale.
                        Następnie dodaj wyniki zawodników.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="w-full">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="count"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Liczba zawodników</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" onChange={(e) => {
                                                const value = Number.parseInt(e.target.value);
                                                field.onChange(value || undefined);
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-2">
                                <span>Czy chcesz dodać wyniki?</span>
                                <Checkbox
                                    disabled={!count || count < 2 || count > results.length}
                                    checked={addResults}
                                    onCheckedChange={(val) => setAddResults(!!val)} />
                            </div>

                            {addResults && (count && count <= results.length) && (
                                <div className="grid gap-3">
                                    Wprowadź wyniki finałów
                                    {results.slice(0, count).map((result) => (
                                        <FormField
                                            key={result.number}
                                            control={form.control}
                                            name={"results"}
                                            render={({ field }) => (
                                                <FormItem className="flex justify-between">
                                                    <FormLabel>{result.name}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" className="w-1/2"
                                                            value={field.value.find((r) => r.number === result.number)?.result || 0}
                                                            onChange={(e) => {
                                                                const currentResults = field.value || [];
                                                                const existingResultIndex = currentResults.findIndex(r => r.number === result.number);
                                                                if (existingResultIndex !== -1) {
                                                                    currentResults[existingResultIndex] = { number: result.number, result: Number.parseInt(e.target.value) || 0 };
                                                                } else {
                                                                    currentResults.push({ number: result.number, result: Number.parseInt(e.target.value) || 0 });
                                                                }
                                                                field.onChange(currentResults);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Anuluj</Button>
                            </DialogClose>
                            <Button type="submit">Zapisz zmiany</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}

export default useFinalsButton;