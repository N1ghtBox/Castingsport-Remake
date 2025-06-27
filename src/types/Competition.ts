import PlatformConfig from "./PlatformConfig"
import TimeConfig from "./TimeConfig"

type Competition = {
    id: string,
    name: string,
    dateFrom: Date,
    dateTo: Date
    place: string
    platformConfig: PlatformConfig,
    timeConfig: TimeConfig
}

export default Competition