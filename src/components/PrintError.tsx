import { CloseOutlined } from "@mui/icons-material";

type PrintErrorProps = {
    error: string
}

const PrintError = ({ error }: PrintErrorProps) => {
    return (
        <div className="inset-0 flex items-center justify-center .bg-background backdrop-blur-sm h-full">
            <div className="flex flex-col items-center">
                <CloseOutlined color="error" style={{ fontSize: '50px' }} />
                {error}
            </div>
        </div>
    );
};

export default PrintError;