import { type GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid";
import { Input } from "../ui/input";
import CategoryCombobox from "../ui/CategoryCombobox";
import PrintButton from "../ui/PrintButton";


export function EditToolbar(props: GridSlotProps['toolbar'],) {

    return (
        <GridToolbarContainer style={{ "margin": 10 }}>
            {
                props.search &&
                <Input onChange={(e) => props.search?.(e.target.value)} />
            }
            <CategoryCombobox />
            <PrintButton />
        </GridToolbarContainer>
    );
}
