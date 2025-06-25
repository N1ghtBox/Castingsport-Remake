import { createContext } from "react";
import type { Contestant } from "./Contestant";
import type Team from "./Teams";

type ContestantWithScore = {
    name: Contestant["name"]
    score: number
}

type TeamWithScore = {
    id: string,
    name: string,
    category: Team["category"]
    members: ContestantWithScore[]
    total: number
}

type TeamPlacements = TeamWithScore & { place: number }

export type TeamContextProps = {
    teamResults: TeamPlacements[],
    category: Team["category"],
    setCategory: (newCategory: Team["category"]) => void
};

export const TeamContext = createContext<TeamContextProps>({
    teamResults: [],
    category: "Młodzieży",
    setCategory: () => { }
});
