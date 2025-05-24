import { CompetitonListContext } from "@/BaseLayout";
import moment from 'moment';
import { useContext, useMemo } from "react";
import { useLoaderData } from "react-router";
import CompetitionCard from "../ui/competition-card";

export default function CompetitionList() {
    const year = useLoaderData<number>();
    const context = useContext(CompetitonListContext)

    const filteredCompetitions = useMemo(() => {
        return context.competitions.filter(x => {
            const date = moment(x.dateFrom)
            if (!date.isValid()) return false
            return date.year() === year
        })
    }, [year, context.competitions])

    return (
        <div className=" grid grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-[15px]">
            {[...filteredCompetitions].map(comp => { return (<CompetitionCard key={comp.id} competition={comp} />) })}
        </div>
    )
}