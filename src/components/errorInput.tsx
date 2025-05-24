import { GridEditInputCell, type GridEditInputCellProps } from "@mui/x-data-grid";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
;

export function ErrorInput(props: GridEditInputCellProps) {
    return (
        <Tooltip open={!!props.error} >
            <TooltipTrigger>
                <GridEditInputCell {...props} />
            </TooltipTrigger>
            <TooltipContent customBg="bg-destructive text-white fill-destructive">
                <p>{props.error}</p>
            </TooltipContent>
        </Tooltip>
    );
}