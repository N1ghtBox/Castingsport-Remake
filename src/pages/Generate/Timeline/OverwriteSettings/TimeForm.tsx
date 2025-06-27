import { Label } from "@/components/ui/label"
import { ContestNames, Contests } from "@/types/Contestant"
import { DatePicker, DatePickerProps } from "antd"
import moment, { Moment } from "moment"
import React, { useContext } from "react"
import dayjs from 'dayjs'
import TimeConfig from "@/types/TimeConfig"
import { CompetitonContext } from "@/types/CompetitionContext"

type TimeFormProps = {
    config: TimeConfig
    updateConfig: (event: Contests, value?: Moment) => void
}

const TimeForm: React.FC<TimeFormProps> = ({ config, updateConfig }) => {
    const competitionContext = useContext(CompetitonContext)

    return (
        Array.from(ContestNames)
            .sort((a, b) => a[0].valueOf() - b[0].valueOf())
            .map(([event, name]) => {
                return (
                    <div className="flex w-full max-w-sm items-center gap-3 py-1 min-h-[45px]" key={event}>
                        <Label htmlFor="email" className="w-[60%]">{name}</Label>
                        <DatePicker
                            required
                            placeholder="Nadpisz czas startu"
                            showTime={{ minuteStep: 30, format: "HH:mm" }}
                            minDate={dayjs(competitionContext.compInfo.dateFrom)}
                            maxDate={dayjs(competitionContext.compInfo.dateTo)}
                            onChange={(value) => {
                                updateConfig(event, value ? moment(value.toISOString()) : undefined)
                            }}
                            format={{format:"DD MMM YYYY HH:mm"}}
                            value={config[event] ? dayjs(moment(config[event]).toISOString()) : undefined}
                            onOk={(value: DatePickerProps['value']) => console.log(moment(value?.toISOString()))}
                        />
                    </div>
                )
            })
    )
}

export default TimeForm