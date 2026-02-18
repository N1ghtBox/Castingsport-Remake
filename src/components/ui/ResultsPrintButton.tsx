import { PictureAsPdfOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function ThlonPrintButton() {
	const navigate = useNavigate();
	const { results, category } = useThlonContext();
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Tooltip
			open={showTooltip}
			onOpenChange={(open) => {
				if (category && results.length !== 0) {
					setShowTooltip(false);
					return;
				}
				setShowTooltip(open);
			}}>
			<TooltipTrigger>
				<Button
					onClick={() => navigate("print")}
					disabled={!category || results.length === 0}
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
