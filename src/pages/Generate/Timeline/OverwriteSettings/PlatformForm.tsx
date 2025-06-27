import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ContestNames, Contests } from "@/types/Contestant"
import PlatformConfig from "@/types/PlatformConfig"
import React from "react"

type PlatfromFormProps = {
    config: PlatformConfig
    updateConfig: (event: Contests, value: number) => void
}

const PlatfromForm: React.FC<PlatfromFormProps> = ({ config, updateConfig }) => {
    return (
        Array.from(ContestNames)
            .sort((a, b) => a[0].valueOf() - b[0].valueOf())
            .map(([event, name]) => {
                return (
                    <div className="flex w-full max-w-sm items-center gap-3 py-1 min-h-[45px]" key={event}>
                        <Label htmlFor="email" className="w-[60%]">{name}</Label>
                        <Input
                            className="w-[40%]"
                            type="number"
                            value={config[event] || 0}
                            onChange={(e) => updateConfig(event, Number(e.target.value))} />
                    </div>
                )
            })
    )
}

export default PlatfromForm