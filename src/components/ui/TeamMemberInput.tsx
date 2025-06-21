import type { GridRenderEditCellParams } from "@mui/x-data-grid"
import { Button } from "./button"
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./dialog"
import TeamMemberSelector from "./TeamMemberSelector"
import type Team from "@/types/Teams"
import type { Contestant } from "@/types/Contestant"
import { useEffect, useState } from "react"

type TeamMemberInputProps = {
    contestants: Contestant[]
} & GridRenderEditCellParams<Team & { isNew: boolean }>

const TeamMemberInput = (params: TeamMemberInputProps) => {
    const [open, setOpen] = useState(false)
    const [internalValues, setInternalValues]
        = useState<Array<Contestant["id"]>>([])

    useEffect(() => {
        if (params.hasFocus)
            setOpen(true)
    }, [params.hasFocus])

    return (
        <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
            <DialogTrigger>
                {params.row.memberNames.length > 0 ? params.row.memberNames.join(', ') : "Brak zawodników"}
            </DialogTrigger>
            <DialogContent style={{ width: 'fit-content' }}>
                <DialogTitle>
                    Dodaj zawodników do drużyny
                </DialogTitle>
                <TeamMemberSelector
                    contestants={params.contestants}
                    onChange={ids => setInternalValues(ids)}
                />
                <DialogFooter>
                    <Button type="submit" onClick={() => {
                        params.api.setEditCellValue({ ...params, field: "member", value: internalValues })
                        params.api.setEditCellValue({
                            ...params, field: "memberNames", value:
                                params
                                    .contestants
                                    .filter(cont => internalValues.includes(cont.id))
                                    .map(x => x.name)
                        })
                        setOpen(false)
                    }}>
                        Zapisz zmiany</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TeamMemberInput