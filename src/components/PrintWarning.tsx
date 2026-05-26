import { WarningAmberOutlined } from "@mui/icons-material";

type PrintWarningProps = {
    warning: string
}

const PrintWarning = ({ warning }: PrintWarningProps) => {
    return (
        <div className="inset-0 flex items-center justify-center .bg-background backdrop-blur-sm h-full">
            <div className="flex flex-col items-center">
                <WarningAmberOutlined color="warning" style={{ fontSize: '50px' }} />
                {warning}
            </div>
        </div>
    );
};

export default PrintWarning;