import type React from "react";
import { useMemo } from "react";
import { Combobox } from "@/components/Combobox";
import { Label } from "@/components/ui/label";
import { ContestNames, type Contests } from "@/types/Contestant";
import type OrderConfig from "@/types/OrderConfig";

type TimeFormProps = {
	config: OrderConfig;
	updateConfig: (event: Contests, value: number) => void;
};

const OrderForm: React.FC<TimeFormProps> = ({ config, updateConfig }) => {
	const contestOptions = useMemo(() => {
		return Array.from(ContestNames, ([value, label]) => ({
			label,
			value: value.toString(),
		})).sort((a, b) => Number(a.value) - Number(b.value));
	}, []);

	return Array.from({ length: 9 }, (_, i) => i + 1).map((order) => {
		const currentValue = config?.[order] ? config[order].toString() : order.toString()
		const duplicatedValue = Object.values(config).filter(x => Number(x) === Number(currentValue)).length !== 1

		return (
			<div
				className="flex w-full max-w-sm items-center gap-3 py-1 min-h-[45px]"
				key={order}>
				<Label
					htmlFor="email"
					className="w-[30%]">
					{order} Konkurencja
				</Label>
				<Combobox
					error={duplicatedValue ? "Konkurencja przypisana wielokrotnie" : undefined}
					className="w-[250px]"
					value={
						currentValue
					}
					options={contestOptions}
					onChange={(val) => {
						updateConfig(Number(val), order);
					}}
				/>
			</div>
		);
	});
};

export default OrderForm;
