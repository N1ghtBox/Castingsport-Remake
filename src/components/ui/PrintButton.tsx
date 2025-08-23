import { PictureAsPdfOutlined } from "@mui/icons-material";
import { Button } from "./button";
import { useNavigate } from "react-router";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { ContestContext } from "@/types/ContestContext";

export default function PrintButton() {
	const navigate = useNavigate();
	const contest = React.useContext(ContestContext);
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Tooltip
			open={showTooltip}
			onOpenChange={(open) => {
				if (contest.category && contest.currentContestants.length !== 0) {
					setShowTooltip(false);
					return;
				}
				setShowTooltip(open);
			}}>
			<TooltipTrigger>
				<Button
					onClick={() => navigate("print")}
					disabled={
						!contest.category || contest.currentContestants.length === 0
					}
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
