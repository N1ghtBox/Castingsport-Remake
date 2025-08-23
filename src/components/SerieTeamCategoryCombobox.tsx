import { Categories } from "@/types/Contestant";
import { SerieContext } from "@/types/SerieContext";
import { TeamCategory } from "@/types/Teams";
import React, { useCallback } from "react";
import { Combobox } from "./Combobox";

const options = [
    {
        label: "Młodzieży",
        value: TeamCategory.Junior,
    },
    {
        label: "Seniorów",
        value: TeamCategory.Senior,
    },
    {
        label: "Kobiet",
        value: TeamCategory.Women,
    },
];

export default function SerieTeamCategoryCombobox() {
    const { setTeamCategory, teamCategory } = React.useContext(SerieContext);

    const updateCategory = useCallback(
        (value: string) => {
            setTeamCategory(value);
        },
        [setTeamCategory],
    );

    return (
        <Combobox
            onChange={(val) => updateCategory(val || Categories.Unknown)}
            value={teamCategory}
            options={options}
        />
    );
}
