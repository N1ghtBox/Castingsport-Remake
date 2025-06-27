import React, { useState } from "react"
import type Team from "./types/Teams"
import { TeamContext } from "./types/TeamsContext"
import { Outlet } from "react-router"
import { GetThlonResult } from "./utils/contestUtils"
import { Thlon } from "./types/Contestant"
import { CompetitonContext } from "./types/CompetitionContext"

const TeamProvider = () => {
    const [category, setCategory] = useState<Team["category"]>("Młodzieży")
    const competition = React.useContext(CompetitonContext)

    const TeamFinalScores = React.useMemo(() => {
        return competition.teams
            .filter(x => x.members.length > 0)
            .filter(x => x.category === category)
            .map(team => {

                const members = team.members.map((id) => {
                    const contesant = competition.contestants.find(x => x.id === id)

                    if (!contesant) {
                        console.log("Contestant with Id = %s was not found", id)
                        return {
                            name: '',
                            score: 0
                        }
                    }
                    return {
                        name: contesant.name,
                        score: GetThlonResult(contesant, Thlon['5boj'].from, Thlon['5boj'].to)
                    }
                })

                return {
                    id: team.id,
                    category: team.category,
                    name: team.name,
                    members: members,
                    total: members.reduce((prev, curr) => prev + curr.score, 0)
                }
            }).sort((a, b) => b.total - a.total)
            .map((team, i) => ({ ...team, place: i + 1 }))
    }, [competition.teams, competition.contestants, category])


    return <TeamContext.Provider value={{
        category: category,
        setCategory: (newCategory) => setCategory(newCategory),
        teamResults: TeamFinalScores
    }}>
        <Outlet />
    </TeamContext.Provider>
}
export default TeamProvider