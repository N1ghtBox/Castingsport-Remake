import type PlatformConfig from "./PlatformConfig";
import type TimeConfig from "./TimeConfig";

type Competition = {
	id: string;
	name: string;
	dateFrom: Date;
	dateTo: Date;
	place: string;
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	logoUrl: string;
};

export default Competition;
