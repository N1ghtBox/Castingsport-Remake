import type { Moment } from "moment";
import type { Contests } from "./Contestant";

type TimeConfig = Partial<Record<Contests, Moment>>;

export default TimeConfig;
