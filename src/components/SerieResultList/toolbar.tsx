import {
	GridToolbarContainer
} from "@mui/x-data-grid";
import SerieCategoryCombobox from "../SerieCategoryCombobox";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { PictureAsPdfOutlined } from "@mui/icons-material";

export function EditToolbar() {
	const navigate = useNavigate()

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SerieCategoryCombobox />
			<Button
				onClick={() => navigate("print")}
				variant="outline">
				<PictureAsPdfOutlined />
				PDF
			</Button>
		</GridToolbarContainer>
	);
}
