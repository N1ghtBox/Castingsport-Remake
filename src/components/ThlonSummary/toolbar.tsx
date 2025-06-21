import { type GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid";
import { Input } from "../ui/input";
import PrintButton from "../ui/PrintButton";
import ThlonCategoryCombobox from "../ui/ThlonCategoryCombobox";


export function EditToolbar(props: GridSlotProps['toolbar'],) {

    return (
        <GridToolbarContainer style={{ "margin": 10 }}>
            {
                props.search &&
                <Input onChange={(e) => props.search?.(e.target.value)} />
            }
            <ThlonCategoryCombobox allowDeselect={false} />
            <PrintButton />
        </GridToolbarContainer>
    );
}
