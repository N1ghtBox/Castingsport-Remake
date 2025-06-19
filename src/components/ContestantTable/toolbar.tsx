import { type GridRowsProp, type GridRowModesModel, type GridRowId, type GridSlotProps, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { v7 as uuid } from 'uuid'
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { Categories, type CategoryValues, Contests, type Contest, type Contestant } from "../../types/Contestant";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp<Contestant & { isNew: boolean }>) => (Contestant & { isNew: boolean })[]) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
        pendingRows: GridRowId[],
        saveChanges: (id: GridRowId) => () => void,
        search?: (searchValue: string) => void
    }
}

const defaultContestList: Array<Contest> = [
    { id: Contests.FlySkish, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.FlyDistance, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.Arenberg, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.Skish, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.Distance, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.FlyDistanceDoubleHand, score: 0, takesPart: false, total: 0, time: "" },
    { id: Contests.DistanceDoubleHand, score: 0, takesPart: false, total: 0, time: "" },
    { id: Contests.MultiSkish, score: 0, takesPart: false, total: 0, time: "" },
    { id: Contests.MultiDistance, score: 0, takesPart: false, total: 0, time: "" },
]


export function EditToolbar(props: GridSlotProps['toolbar'],) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = uuid();

        const lastCategoryAdded = window.localStorage.getItem('lastCategoryAdded');

        setRows((oldRows) => [
            {
                id,
                name: '',
                number: Math.max(...oldRows.map(x => x.number), 0) + 1,
                category: lastCategoryAdded as CategoryValues || Categories.Junior,
                club: "",
                contests: defaultContestList.map(x => { return { ...x } }),
                isNew: true
            },
            ...oldRows,
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    const saveAllPendingChanges = () => {
        for (let i = 0; i < props.pendingRows.length; i++) {
            const element = props.pendingRows[i];
            props.saveChanges(element)();

        };
    }

    return (
        <GridToolbarContainer style={{ "margin": 10 }}>
            <Button color="primary" onClick={handleClick}>
                <AddIcon />
                Dodaj
            </Button>
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
        </GridToolbarContainer>
    );
}
