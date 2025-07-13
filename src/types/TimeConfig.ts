import { Moment } from "moment";
import { Contests } from "./Contestant";

type TimeConfig = Partial<Record<Contests, Moment>>;

export default TimeConfig;
