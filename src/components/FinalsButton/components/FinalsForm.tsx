"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrophyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import TimeInput from "@/components/timeInput";
import ProgramConsts from "@/consts/Consts";
import { useContestContext } from "@/context/contest/ContestContext";
import { Contests } from "@/types/Contestant";
import { Button } from "./../../ui/button";
import { Checkbox } from "./../../ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./../../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./../../ui/form";
import { Input } from "./../../ui/input";
import { Label } from "./../../ui/label";
import type { FormData, FormProps } from "../types/FinalsForm.types";

const createSchema = (count: number, mutliplier = 2) =>
    z.object({
        finals: z
            .array(
                z.object({
                    number: z.string(),
                    time: z.string().nonempty("Czas jest wymagany"),
                    result: z
                        .number()
                        .min(0, "Wynik nie może być mniejszy niż 0")
                        .max(100, "Wynik nie może być większy niż 100")
                        .refine(
                            (x) => x % mutliplier === 0,
                            `Wartość musi być wielokrotnością ${mutliplier}`,
                        ),
                }),
            )
            .length(count),
    });

export default function FinalsForm({ callback, results, id }: FormProps) {
    const [openModal, setOpenModal] = useState(false);
    const [addResults, setAddResults] = useState(false);
    const [count, setCount] = useState<number | undefined>(
        ProgramConsts.DefaultFinalCount,
    );
    const { contestId } = useContestContext()
    const [schema, setSchema] = useState(() => createSchema(0));

    const form = useForm<z.infer<ReturnType<typeof createSchema>>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            finals: [],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "finals",
    });

    useEffect(() => {
        const inputCount = Number(count);
        if (!Number.isNaN(inputCount) && inputCount >= 0) {
            setSchema(createSchema(inputCount, contestId === Contests.Arenberg ? 2 : 5));

            // Update fields to match count
            const diff = inputCount - fields.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++)
                    append({ number: results[i]?.number || "0", result: 0, time: "" });
            } else {
                for (let i = 0; i < -diff; i++) remove(fields.length - 1);
            }
        }
    }, [results, count, append, fields.length, remove]);

    useEffect(() => {
        const storedCount = window.localStorage.getItem(`finals-${id}`);
        if (storedCount && count === ProgramConsts.DefaultFinalCount) {
            if (!Number.isNaN(Number(storedCount))) {
                setCount(Number(storedCount));
            }
        }
    }, [id, count]);

    const clearForm = useCallback(() => {
        remove();
        setCount(ProgramConsts.DefaultFinalCount);
        setAddResults(false);
    }, [remove]);

    useEffect(() => {
        if (!openModal) return clearForm();
        const json = window.localStorage.getItem(`finals-${id}-results`);
        if (!json) return clearForm();
        const results = JSON.parse(json) as FormData;
        if (!results?.finals) return clearForm();

        setAddResults(true);
        replace(results.finals);
    }, [openModal, id, replace, clearForm]);

    const onSubmit = (data: z.infer<typeof schema>) => {
        callback(count, addResults ? data : undefined);
        if (addResults)
            window.localStorage.setItem(`finals-${id}-results`, JSON.stringify(data));
        setOpenModal(false);
    };

    const onInvalid = () => {
        if (!addResults) {
            window.localStorage.setItem(`finals-${id}`, count?.toString() || "");
            callback(count);
            setOpenModal(false);
        }
    };

    return (
        <Dialog
            open={openModal}
            onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <TrophyIcon />
                    Finały
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Tworzenie finałów</DialogTitle>
                    <DialogDescription>
                        Wprowadź liczbę zawodników, którzy wezmą udział w finale. Następnie
                        dodaj wyniki zawodników.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex w-full max-w-sm items-center gap-3 py-1 min-h-11.25">
                    <Label
                        htmlFor="email"
                        className="w-[60%]">
                        Ilość zawodników w finałach
                    </Label>
                    <Input
                        value={count}
                        type="number"
                        onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            setCount(value || undefined);
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span>Czy chcesz dodać wyniki?</span>
                    <Checkbox
                        className="border-white"
                        disabled={!count || count < 2 || count > results.length}
                        checked={addResults}
                        onCheckedChange={(val) => {
                            setAddResults(!!val);
                        }}
                    />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                        className="w-full">
                        <div className="grid gap-4">
                            {addResults && count && count <= results.length && (
                                <div className="grid gap-3">
                                    Wprowadź wyniki finałów
                                    {fields.map((field, index) => {
                                        const result = results[index];

                                        return (
                                            <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`finals.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <div className="flex justify-between gap-2">
                                                            <FormLabel className="w-[50%]">
                                                                {result?.name}
                                                            </FormLabel>
                                                            <FormControl className="w-[30%]">
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    value={field.value.result}
                                                                    onChange={(e) => {
                                                                        field.onChange({
                                                                            ...field.value,
                                                                            result:
                                                                                e.target.value !== ""
                                                                                    ? Number(e.target.value)
                                                                                    : undefined,
                                                                        });
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormControl>
                                                                <TimeInput
                                                                    {...field}
                                                                    className="w-[20%]"
                                                                    value={field.value.time}
                                                                    onChange={(e) => {
                                                                        field.onChange({ ...field.value, time: e });
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Anuluj</Button>
                            </DialogClose>
                            <Button type="submit">Zapisz</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
