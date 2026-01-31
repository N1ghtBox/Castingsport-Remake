import { zodResolver } from "@hookform/resolvers/zod";
import { TrophyIcon } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, useLoaderData } from "react-router";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResultRow } from "@/pages/Print/ContestPrint/ContestResults";
import { ContestContext } from "@/types/ContestContext";
import { TypeOfContest } from "@/utils/contestUtils";

type ButtonProps = {
	callback: (
		count: number | undefined,
		data?: z.infer<ReturnType<typeof createSchema>>,
	) => void;
	id: string;
	results: ResultRow[];
};

const useFinalsButton = (id: string, results: ResultRow[]) => {
	const contestId = useLoaderData() as number;
	const [finalCount, setFinalCount] = useState<number | undefined>(undefined);
	const [finalResults, setFinalResults] = useState<
		z.infer<ReturnType<typeof createSchema>> | undefined
	>(undefined);

	const hasSaveResults = useMemo(() => {
		return !!window.localStorage.getItem(`finals-${id}-results`);
	}, [id]);

	const loadSavedResults = () => {
		const json = window.localStorage.getItem(`finals-${id}-results`);
		if (!json) return;
		const results = JSON.parse(json) as z.infer<
			ReturnType<typeof createSchema>
		>;
		setFinalResults(results);
	};

	return {
		finalResults,
		count: finalCount,
		FinalsButton: () =>
			TypeOfContest(contestId) === "time" && (
				<div className="flex gap-5">
					<FinalsButton
						callback={(count, data) => {
							setFinalCount(count);
							setFinalResults(data);
						}}
						id={id}
						results={results}
					/>
					<Button
						disabled={!hasSaveResults}
						onClick={loadSavedResults}>
						Zapisane finały
					</Button>
				</div>
			),
	};
};

export default useFinalsButton;
