import React, { useState } from "react";
import { Outlet } from "react-router";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { TeamContext } from "@/context/team/TeamContext";
import type { TeamContextProps } from "@/context/team/TeamContext.types";
import type { TeamCategoryValues } from "@/types/Teams";
import { GenerateTeamResults } from "@/utils/teamUtils";

const TeamLayout = () => {
    const [category, setCategory] = useState<TeamCategoryValues | undefined>(
        undefined,
    );
    const { teams, contestants } = useCompetitionContext();

    const TeamFinalScores = React.useMemo(() => {
        if (!category) return [];
        return GenerateTeamResults(teams, contestants, category);
    }, [teams, contestants, category]);

    return (
        <TeamContext.Provider
            value={
                {
                    category: category,
                    setCategory: (newCategory) => setCategory(newCategory),
                    teamResults: TeamFinalScores,
                } as TeamContextProps
            }>
            <Outlet />
        </TeamContext.Provider>
    );
};
export default TeamLayout;
