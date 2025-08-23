import React, { useCallback, useMemo } from "react";
import { Categories } from "@/types/Contestant";
import { SerieContext } from "@/types/SerieContext";
import { Combobox } from "./Combobox";
import { useLoaderData } from "react-router";
import { getThlonEnumName } from "@/utils/contestUtils";

const options = [
    {
        label: "Juniorzy",
        value: Categories.Junior,
    },
    {
        label: "Juniorki",
        value: Categories.Juniorka,
    },
    {
        label: "Mężczyźni",
        value: Categories.Man,
    },
    {
        label: "Kobiety",
        value: Categories.Kobieta,
    },
];

export default function SerieCategoryCombobox() {
    const { setCategory, category } = React.useContext(SerieContext);
    const { from, to } = useLoaderData()

    const updateCategory = useCallback(
        (value: string) => {
            setCategory(value);
        },
        [setCategory],
    );

    const filteredOptions = useMemo(() => {
        const thlonName = getThlonEnumName(from, to)
        if (thlonName !== 'distance' && thlonName !== 'multi') return options

        return options.slice(2)
    }, [from, to])

    return (
        <Combobox
            onChange={(val) => updateCategory(val || Categories.Unknown)}
            value={category}
            options={filteredOptions}
        />
    );
}
