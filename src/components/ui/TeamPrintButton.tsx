import { TeamContext } from "@/types/TeamsContext";
import { PictureAsPdfOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function TeamPrintButton() {
	const navigate = useNavigate();
	const teamContext = React.useContext(TeamContext);
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Tooltip
			open={showTooltip}
			onOpenChange={(open) => {
				if (teamContext.teamResults.length !== 0) {
					setShowTooltip(false);
					return;
				}
				setShowTooltip(open);
			}}>
			<TooltipTrigger>
				<Button
					onClick={() => navigate("print")}
					disabled={teamContext.teamResults.length === 0}
					variant="outline"
					className="w-full">
					<PictureAsPdfOutlined />
					PDF
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Należy wybrać kategorię aby wygenerować pdf.</p>
			</TooltipContent>
		</Tooltip>
	);
}
