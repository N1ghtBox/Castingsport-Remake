import type { Series } from "@/types/Series"
import { useNavigate } from "react-router"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import React from "react"
import { MenuListContext } from "@/BaseLayout"


type SeriesCardProps = {
    series: Series
}

export default function SeriesCard({ series }: SeriesCardProps) {
    const { competitions } = React.useContext(MenuListContext)
    const navigate = useNavigate()

    return (<Card className="@container/card hover:cursor-pointer" onClick={() => navigate(`/serie/${series.id}`)}>
        <CardHeader className="relative">
            <CardDescription>Cykl</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {series.name}
            </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                Lista zawodów
            </div>
            <div className="text-muted-foreground">
                <ul>
                    {
                        series.competitionIds.map((id) => {
                            const comp = competitions.find(x => x.id === id)
                            if (!comp) return ""
                            return <li key={id}>{comp.name}</li>
                        })
                    }
                </ul>
            </div>
        </CardFooter>
    </Card>)
}