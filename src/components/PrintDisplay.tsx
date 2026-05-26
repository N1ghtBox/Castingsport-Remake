import type { UsePDFInstance } from "@react-pdf/renderer";
import LoadingData from "./LoadingData";
import PrintError from "./PrintError";

type PrintDisplayProps = {
    instance: UsePDFInstance;
    loadingMessage?: string;
    invalidComponent?: JSX.Element
};

export default function PrintDisplay({ instance, loadingMessage, invalidComponent }: PrintDisplayProps) {
    if (invalidComponent)
        return invalidComponent
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
