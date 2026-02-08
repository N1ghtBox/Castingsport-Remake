type LoadingDataProps = {
    message?: string
}

const LoadingData = ({ message = "Ładowanie wyników" }: LoadingDataProps) => {
    return (
        <div className="inset-0 flex items-center justify-center .bg-background backdrop-blur-sm h-full">
            <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
                {message}
            </div>
        </div>
    );
};

export default LoadingData;