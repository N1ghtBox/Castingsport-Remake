import type { UsePDFInstance } from "@react-pdf/renderer";
import LoadingData from "./LoadingData";
import PrintError from "./PrintError";

type PrintDisplayProps = {
    instance: UsePDFInstance;
    loadingMessage?: string
};

export default function PrintDisplay({ instance, loadingMessage }: PrintDisplayProps) {
    return (
        <>
            {instance.loading && <LoadingData message={loadingMessage} />}
            {instance.error && <PrintError error={instance.error} />}

            {instance.url && !instance.loading && (
                <div className="h-[92vh]">
                    <iframe
                        src={instance.url}
                        width="100%"
                        height="100%"
                        title="PDF Preview"
                    />
                </div>
            )}
        </>
    );
}
