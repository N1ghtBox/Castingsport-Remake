import React, { useCallback } from "react";
import { Categories } from "@/types/Contestant";
import { SerieContext } from "@/types/SerieContext";
import { Combobox } from "./Combobox";

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

    const updateCategory = useCallback(
        (value: string) => {
            setCategory(value);
        },
        [setCategory],
    );

    return (
        <Combobox
            onChange={(val) => updateCategory(val || Categories.Unknown)}
            value={category}
            options={options}
        />
    );
}
