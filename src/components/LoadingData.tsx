import { useTranslation } from "react-i18next";

type LoadingDataProps = {
    message?: string
}

const LoadingData = ({ message }: LoadingDataProps) => {
    const { t } = useTranslation();
    const displayMessage = message ?? t("print.loadingResults");

    return (
        <div className="inset-0 flex items-center justify-center .bg-background backdrop-blur-sm h-full">
            <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
                {displayMessage}
            </div>
        </div>
    );
};

export default LoadingData;
