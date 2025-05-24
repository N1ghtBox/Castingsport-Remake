import React from "react"
import { ContestContext } from "../ContestScoreEditor"
import { Combobox } from "../Combobox"
import { Categories, CategoryValues } from "@/types/Contestant"

const options = [
  {
    label: "Kadeci",
    value: Categories.Kadet
  }, {
    label: "Juniorzy",
    value: Categories.Junior
  }, {
    label: "Juniorki",
    value: Categories.Juniorka
  }, {
    label: "Mężczyźni",
    value: Categories.Man
  }, {
    label: "Kobiety",
    value: Categories.Kobieta
  },
]

export default function CategoryCombobox() {
  const contest = React.useContext(ContestContext)

  return (<Combobox
    onChange={(value) => contest.setCategoryFilter(value as CategoryValues | undefined)}
    value={contest.category}
    options={options}
  />)
}