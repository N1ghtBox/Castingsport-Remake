import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { OrderConfig, PlatformConfig, TimeConfig } from "@/types/Competition";
import CombinedForm from "./CombinedForm";

const Default_OrderConfig = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
};

type Settings = {
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
};

const OverwriteSettings = () => {
	const { compInfo, updateConfig } = useCompetitionContext();
	const [newSettings, setNewSettings] = useState<Settings>({
		platformConfig: compInfo.platformConfig,
		timeConfig: compInfo.timeConfig,
		orderConfig: compInfo.orderConfig || Default_OrderConfig,
	});

	const [hasOrderError, setHasOrderError] = useState(false);

	useEffect(() => {
		if (!newSettings.orderConfig) return;
		const values = Object.values(newSettings.orderConfig);
		setHasOrderError(new Set(values).size !== values.length);
	}, [newSettings.orderConfig]);

	useEffect(() => {
		setNewSettings({
			platformConfig: compInfo.platformConfig,
			timeConfig: compInfo.timeConfig,
			orderConfig: compInfo.orderConfig || Default_OrderConfig,
		});
	}, [compInfo]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"}>
					<Settings2 />
					Ustawienia
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Ustawienia rozpiski</DialogTitle>
				</DialogHeader>
				<CombinedForm
					orderConfig={newSettings.orderConfig}
					platformConfig={newSettings.platformConfig}
					timeConfig={newSettings.timeConfig}
					updateOrder={(contest, slot) =>
						setNewSettings((prev) => ({
							...prev,
							orderConfig: { ...prev.orderConfig, [slot]: contest },
						}))
					}
					updatePlatform={(contest, value) =>
						setNewSettings((prev) => ({
							...prev,
							platformConfig: { ...prev.platformConfig, [contest]: value },
						}))
					}
					updateTime={(contest, value) =>
						setNewSettings((prev) => ({
							...prev,
							timeConfig: { ...prev.timeConfig, [contest]: value },
						}))
					}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Anuluj</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							type="submit"
							disabled={hasOrderError}
							onClick={async () => {
								await updateConfig(newSettings);
							}}>
							Zapisz
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OverwriteSettings;
