import { PictureAsPdfOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router";
import { useContestContext } from "@/context/contest/ContestContext";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function PrintButton() {
	const navigate = useNavigate();
	const { currentContestants, category } = useContestContext();
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Tooltip
			open={showTooltip}
			onOpenChange={(open) => {
				if (category && currentContestants.length !== 0) {
					setShowTooltip(false);
					return;
				}
				setShowTooltip(open);
			}}>
			<TooltipTrigger>
				<Button
					onClick={() => navigate("print")}
					disabled={!category || currentContestants.length === 0}
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
