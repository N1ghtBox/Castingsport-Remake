import type Competition from "./Competition";
import type { Series } from "./Series";

type GeneralDataJson = {
	competitions: Array<Competition>;
	series: Array<Series>;
};

export default GeneralDataJson;
