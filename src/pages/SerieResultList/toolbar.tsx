import { PictureAsPdfOutlined } from "@mui/icons-material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "antd";
import { useNavigate } from "react-router";
import SerieCategoryCombobox from "../../components/SerieCategoryCombobox";

export function EditToolbar() {
	const navigate = useNavigate();

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
