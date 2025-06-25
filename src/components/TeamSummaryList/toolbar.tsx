import { type GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid";
import { Input } from "../ui/input";
import TeamCategoryCombobox from "../ui/TeamCategoryCombobox";
import TeamPrintButton from "../ui/TeamPrintButton";


export function EditToolbar(props: GridSlotProps['toolbar'],) {

    return (
        <GridToolbarContainer style={{ "margin": 10 }}>
            {
                props.search &&
                <Input onChange={(e) => props.search?.(e.target.value)} />
            }
            <TeamCategoryCombobox />
            <TeamPrintButton />
        </GridToolbarContainer>
    );
}
