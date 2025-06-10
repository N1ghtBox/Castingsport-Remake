import React, { useCallback, useEffect } from "react"
import { ContestContext } from "../ContestScoreEditor"
import { Combobox } from "../Combobox"
import { Categories, type CategoryValues } from "@/types/Contestant"
import { useSearchParams } from "react-router"

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
  const [query, setQuery] = useSearchParams();

  const updateCategory = useCallback((value: string | undefined) => {
    contest.setCategoryFilter(value as CategoryValues | undefined)
  },[contest.setCategoryFilter])

  useEffect(() => {
    if(query.get('category') && contest.category === undefined) {
      updateCategory(query.get('category') || undefined)
      setQuery(prev => ({...prev, category: ""}))
    }

  },[updateCategory, query.get, contest.category, setQuery])

  return (<Combobox
    onChange={updateCategory}
    value={contest.category}
    options={options}
  />)
}