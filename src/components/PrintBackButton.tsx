import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const PrintBackButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            variant={"outline"}
            onClick={() => navigate("..")}>
            <ChevronLeft /> Wróć
        </Button>
    );
};

export default PrintBackButton;
