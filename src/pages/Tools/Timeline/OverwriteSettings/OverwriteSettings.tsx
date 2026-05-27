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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { OrderConfig, PlatformConfig, TimeConfig } from "@/types/Competition";
import OrderForm from "./OrderForm";
import PlatfromForm from "./PlatformForm";
import TimeForm from "./TimeForm";

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

type SettingsError = {
	[K in keyof Settings]: boolean;
};

const OverwriteSettings = () => {
	const { compInfo, updateConfig } = useCompetitionContext();
	const [newSettings, setNewSettings] = useState<Settings>({
		platformConfig: compInfo.platformConfig,
		timeConfig: compInfo.timeConfig,
		orderConfig: compInfo.orderConfig || Default_OrderConfig,
	});

	const [errors, setErrors] = useState<SettingsError>({
		platformConfig: false,
		timeConfig: false,
		orderConfig: false,
	});

	useEffect(() => {
		if (!newSettings.orderConfig) {
			return;
		}
		const values = Object.values(newSettings.orderConfig);
		const hasDupes = new Set(values).size !== values.length;

		if (!hasDupes) {
			setErrors((prev) => ({
				...prev,
				orderConfig: false,
			}));

			return;
		}

		setErrors((prev) => ({
			...prev,
			orderConfig: true,
		}));
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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Ustawienia rozpiski</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="platforms">
					<TabsList>
						<TabsTrigger value="platforms">Rzutnie</TabsTrigger>
						<TabsTrigger value="order">Kolejność</TabsTrigger>
						<TabsTrigger value="times">Czasy konkurencji</TabsTrigger>
					</TabsList>
					<TabsContent value="platforms">
						<PlatfromForm
							config={newSettings.platformConfig}
							updateConfig={(event, value) => {
								setNewSettings((prev) => ({
									...prev,
									platformConfig: { ...prev.platformConfig, [event]: value },
								}));
							}}
						/>
					</TabsContent>
					<TabsContent value="order">
						<OrderForm
							config={newSettings.orderConfig}
							updateConfig={(event, value) => {
								setNewSettings((prev) => ({
									...prev,
									orderConfig: { ...prev.orderConfig, [value]: event },
								}));
							}}
						/>
					</TabsContent>
					<TabsContent value="times">
						<TimeForm
							config={newSettings.timeConfig}
							updateConfig={(event, value) => {
								setNewSettings((prev) => ({
									...prev,
									timeConfig: { ...prev.timeConfig, [event]: value },
								}));
							}}
						/>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Anuluj</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							type="submit"
							disabled={Object.values(errors).filter(Boolean).length !== 0}
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
