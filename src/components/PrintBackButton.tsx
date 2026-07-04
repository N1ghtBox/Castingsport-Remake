import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const PrintBackButton = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Button
            variant={"outline"}
            onClick={() => navigate("..")}>
            <ChevronLeft /> {t("common.back")}
        </Button>
    );
};

export default PrintBackButton;
