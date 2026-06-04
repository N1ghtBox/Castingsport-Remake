"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { TrophyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import DecimalInput from "@/components/decimalInput";
import TimeInput from "@/components/timeInput";
import ProgramConsts from "@/consts/Consts";
import { useContestContext } from "@/context/contest/ContestContext";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import { Contests } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import type { ResultRow } from "@/pages/Print/ContestPrint/ContestResults";
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
import type { FormData, FormProps } from "../types/FinalsForm.types";

type Phase = "selecting" | "entering_results";

type FinalItem = {
    number: string;
    time?: string;
    result?: number;
    score?: string;
};

const createSchema = (count: number, isTime: boolean, multiplier = 2, t: TFunction) =>
    z.object({
        finals: z
            .array(
                z
                    .object({
                        number: z.string(),
                        time: z.string().optional(),
                        result: z.number().optional(),
                        score: z.string().optional(),
                    })
                    .superRefine((item, ctx) => {
                        if (isTime) {
                            if (!item.time)
                                ctx.addIssue({ code: "custom", message: t("validation.timeRequired"), path: ["time"] });
                            if (item.result === undefined)
                                ctx.addIssue({ code: "custom", message: t("validation.resultRequired"), path: ["result"] });
                            else {
                                if (item.result < 0)
                                    ctx.addIssue({ code: "custom", message: t("validation.resultMin"), path: ["result"] });
                                if (item.result > 100)
                                    ctx.addIssue({ code: "custom", message: t("validation.resultMax"), path: ["result"] });
                                if (item.result % multiplier !== 0)
                                    ctx.addIssue({ code: "custom", message: t("validation.resultMultiple", { multiplier }), path: ["result"] });
                            }
                        } else {
                            if (!item.score)
                                ctx.addIssue({ code: "custom", message: t("validation.resultRequired"), path: ["score"] });
                        }
                    }),
            )
            .length(count),
    });

export default function FinalsForm({ callback, results, id, disabled }: FormProps) {
    const [openModal, setOpenModal] = useState(false);
    const [phase, setPhase] = useState<Phase>("selecting");
    const [selectedCount, setSelectedCount] = useState(0);
    const [qualifiers, setQualifiers] = useState<ResultRow[]>([]);
    const { contestId } = useContestContext();
    const isTimeContest = TypeOfContest(contestId) === "time";
    const multiplier = contestId === Contests.Arenberg ? 2 : 5;
    const { t } = useTranslation();
    const [schema, setSchema] = useState(() => createSchema(0, isTimeContest, multiplier, t));

    const form = useForm<{ finals: FinalItem[] }>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { finals: [] as FinalItem[] },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "finals",
    });

    const emptyItem = useCallback(
        (r: ResultRow): FinalItem =>
            isTimeContest
                ? { number: r.number, result: 0, time: "" }
                : { number: r.number, score: "" },
        [isTimeContest],
    );

    useEffect(() => {
        if (!openModal) {
            setSelectedCount(0);
            setQualifiers([]);
            form.reset({ finals: [] });
            return;
        }

        const savedQualifiersRaw = window.localStorage.getItem(`finals-${id}-qualifiers`);
        if (savedQualifiersRaw) {
            try {
                LoggingProvider.LogInfo(`Reading saved qualifiers for finals id = ${id}.`);
                const numbers = JSON.parse(savedQualifiersRaw) as string[];
                const qualifierRows = numbers
                    .map((n) => results.find((r) => r.number === n))
                    .filter((r): r is ResultRow => r !== undefined);

                if (qualifierRows.length > 0) {
                    setQualifiers(qualifierRows);
                    setPhase("entering_results");
                    const newSchema = createSchema(qualifierRows.length, isTimeContest, multiplier, t);
                    setSchema(newSchema);

                    const savedResultsRaw = window.localStorage.getItem(`finals-${id}-results`);
                    if (savedResultsRaw) {
                        try {
                            LoggingProvider.LogInfo(`Reading saved finals results for id = ${id}.`);
                            const parsed = JSON.parse(savedResultsRaw) as FormData;
                            if (parsed?.finals) {
                                replace(parsed.finals);
                                return;
                            }
                        } catch {}
                    }
                    replace(qualifierRows.map(emptyItem));
                    return;
                }
            } catch {}
        }

        setPhase("selecting");
        const savedCount = window.localStorage.getItem(`finals-${id}`);
        const defaultCount =
            savedCount && !Number.isNaN(Number(savedCount))
                ? Number(savedCount)
                : (ProgramConsts.DefaultFinalCount ?? 3);
        setSelectedCount(Math.min(defaultCount, results.length));
    }, [openModal, id, results, isTimeContest, multiplier, replace, form, emptyItem, t]);

    const toggleCheck = useCallback((index: number) => {
        setSelectedCount(index + 1);
    }, []);

    const confirmQualifiers = useCallback(() => {
        const qualifierRows = results.slice(0, selectedCount);
        const count = qualifierRows.length;
        const numbers = qualifierRows.map((r) => r.number);

        LoggingProvider.LogData(`Saving qualifiers for finals id = ${id}.`, { numbers, count });
        window.localStorage.setItem(`finals-${id}-qualifiers`, JSON.stringify(numbers));
        window.localStorage.setItem(`finals-${id}`, count.toString());
        callback(count);

        setQualifiers(qualifierRows);
        setPhase("entering_results");
        setSchema(createSchema(count, isTimeContest, multiplier, t));
        replace(qualifierRows.map(emptyItem));
    }, [selectedCount, results, id, callback, isTimeContest, multiplier, replace, emptyItem, t]);

    const resetQualifiers = useCallback(() => {
        LoggingProvider.LogInfo(`Resetting qualifiers for finals id = ${id}.`);
        window.localStorage.removeItem(`finals-${id}-qualifiers`);
        window.localStorage.removeItem(`finals-${id}-results`);
        setPhase("selecting");
        setQualifiers([]);
        form.reset({ finals: [] });
        const savedCount = window.localStorage.getItem(`finals-${id}`);
        const defaultCount =
            savedCount && !Number.isNaN(Number(savedCount))
                ? Number(savedCount)
                : (ProgramConsts.DefaultFinalCount ?? 3);
        setSelectedCount(Math.min(defaultCount, results.length));
    }, [id, results, form]);

    const onSubmit = (data: { finals: FinalItem[] }) => {
        LoggingProvider.LogData(`Saving finals results for id = ${id}.`, data);
        window.localStorage.setItem(`finals-${id}-results`, JSON.stringify(data));
        callback(qualifiers.length, data as FormData);
        setOpenModal(false);
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2" disabled={disabled}>
                    <TrophyIcon />
                    {t("finals.button")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                {phase === "selecting" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>{t("finals.qualificationsTitle")}</DialogTitle>
                            <DialogDescription>
                                {t("finals.qualificationsDesc")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid max-h-96 overflow-y-auto">
                            {results.map((result, index) => (
                                <div
                                    key={result.number}
                                    className="flex items-center gap-3 px-1 py-1.5 rounded hover:bg-accent cursor-pointer"
                                    onClick={() => toggleCheck(index)}
                                >
                                    <Checkbox
                                        className="border-white"
                                        checked={index < selectedCount}
                                        onCheckedChange={() => toggleCheck(index)}
                                    />
                                    <span className="w-8 text-sm text-muted-foreground">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 text-sm">{result.name}</span>
                                    <span className="text-sm text-muted-foreground">{result.club}</span>
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">{t("common.cancel")}</Button>
                            </DialogClose>
                            <Button
                                onClick={confirmQualifiers}
                                disabled={selectedCount === 0}
                            >
                                {t("finals.confirmQualifications", { count: selectedCount })}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>{t("finals.resultsTitle")}</DialogTitle>
                            <DialogDescription>
                                {t("finals.resultsDesc", { count: qualifiers.length })}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                <div className="grid gap-3 max-h-96 overflow-y-auto">
                                    {fields.map((field, index) => {
                                        const qualifier = qualifiers[index];
                                        return (
                                            <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`finals.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <div className="flex justify-between gap-2">
                                                            <FormLabel className="w-[50%]">
                                                                {qualifier?.name}
                                                            </FormLabel>
                                                            {isTimeContest ? (
                                                                <>
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
                                                                            value={field.value.time ?? ""}
                                                                            onChange={(e) => {
                                                                                field.onChange({
                                                                                    ...field.value,
                                                                                    time: e,
                                                                                });
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </>
                                                            ) : (
                                                                <FormControl className="w-[45%]">
                                                                    <DecimalInput
                                                                        {...field}
                                                                        value={field.value.score ?? ""}
                                                                        onChange={(e) => {
                                                                            field.onChange({
                                                                                ...field.value,
                                                                                score: e,
                                                                            });
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                                <DialogFooter className="mt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={resetQualifiers}
                                    >
                                        {t("finals.changeQualifications")}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="outline">{t("common.cancel")}</Button>
                                    </DialogClose>
                                    <Button type="submit">{t("finals.saveResults")}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
