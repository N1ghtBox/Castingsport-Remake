import SaveIcon from '@mui/icons-material/Save';
import { type GridRowId, type GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CategoryCombobox from '../ui/CategoryCombobox';
import { useNavigate } from 'react-router';
import { Print } from '@mui/icons-material';


declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        pendingRows: GridRowId[],
        saveChanges: (id: GridRowId) => () => void,
        search?: (searchValue: string) => void
    }
}


export function EditToolbar(props: GridSlotProps['toolbar'],) {
    const navigate = useNavigate()

    const saveAllPendingChanges = () => {
        for (let i = 0; i < props.pendingRows.length; i++) {
            const element = props.pendingRows[i];
            props.saveChanges(element)();

        };
    }

    return (
        <GridToolbarContainer style={{ "margin": 10 }}>
            <Button
                color="primary"
                disabled={props.pendingRows.length === 0}
                onClick={saveAllPendingChanges}>
                <SaveIcon />
                Zapisz zmiany
            </Button>
            {
                props.search &&
                <Input onChange={(e) => props.search?.(e.target.value)} />
            }

            <CategoryCombobox />
            <Button onClick={() => navigate("print")}>
                <Print />
                Drukuj
            </Button>
        </GridToolbarContainer>
    );
}
