import type Competition from "@/types/Competition"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { useNavigate } from "react-router"
import moment from "moment"


type CompetitionCardProps = {
    competition: Competition
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
    const navigate = useNavigate()

    return (<Card className="@container/card hover:cursor-pointer" onClick={() => navigate(`/competition/${competition.id}`)}>
        <CardHeader className="relative">
            <CardDescription>Zawody</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {competition.name}
            </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                {competition.place}
            </div>
            <div className="text-muted-foreground">
                {moment(competition.dateFrom).format('LL')} - {moment(competition.dateTo).format('LL')}
            </div>
        </CardFooter>

    </Card>)
}