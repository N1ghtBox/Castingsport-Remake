import { useCallback } from "react";

const usePDFActions = () => {
    const downloadPDF = useCallback(async (blob: Blob | null, filename = 'document.pdf') => {
        try {
            if(blob === null) throw new Error("Błąd danych")
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    }, []);

    const printPDF = useCallback(async (blob: Blob | null) => {
        try {
            if(blob === null) throw new Error("Błąd danych")
            const url = URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;

            document.body.appendChild(iframe);

            iframe.onload = () => {
                if (!iframe.contentWindow) return;
                iframe.contentWindow.print();

                iframe.contentWindow.onafterprint = () => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                }
            };
        } catch (error) {
            console.error('Error printing PDF:', error);
        }
    }, []);

    const openPDF = useCallback(async (blob: Blob) => {
        try {
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');

            // Clean up after a delay
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 10000);
        } catch (error) {
            console.error('Error opening PDF:', error);
        }
    }, []);

    return { downloadPDF, printPDF, openPDF };
};

export default usePDFActions