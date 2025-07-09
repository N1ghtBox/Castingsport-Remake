import type Competition from "./Competition";
import type { Series } from "./Series";

export type MenuListContextProps = {
    competitions: Array<Competition>;
    series: Array<Series>
};