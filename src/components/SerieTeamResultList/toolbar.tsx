import { PictureAsPdfOutlined } from "@mui/icons-material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import SerieTeamCategoryCombobox from "../SerieTeamCategoryCombobox";
import { Button } from "../ui/button";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides { }
}

export function EditToolbar() {
	const navigate = useNavigate();

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SerieTeamCategoryCombobox />
			<Button
				onClick={() => navigate("print")}
				variant="outline">
				<PictureAsPdfOutlined />
				PDF
			</Button>
		</GridToolbarContainer>
	);
}
