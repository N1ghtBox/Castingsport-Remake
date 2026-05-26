import { PictureAsPdfOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { Button } from "./button";

export default function PrintButton() {
	const navigate = useNavigate();

	return (

		<Button
			onClick={() => navigate("print")}
			variant="outline"
			className="w-fit">
			<PictureAsPdfOutlined />
			PDF
		</Button>
	);
}
