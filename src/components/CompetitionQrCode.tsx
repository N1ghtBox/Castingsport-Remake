import { Image, View } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { useEffect, useState } from "react";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import { Competition } from "@/types/Competition";

export type QrCodeProps = {
    comp: Competition
    tab: string,
    category: string
    /** Subcategory id; points the QR at that subcategory's synced document. */
    subcategoryId?: string
}

export default function CompetitionQrCode({ comp, tab, category, subcategoryId }: QrCodeProps) {
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        const id = subcategoryId ? `${comp.id.trim()}-${subcategoryId}` : comp.id.trim();
        QRCode.toDataURL(`https://castingsport-result-web.vercel.app/competition/${id}?tab=${tab}&category=${category}`)
            .then(url => setQrDataUrl(url))
            .catch(err => LoggingProvider.LogException("QR code generation failed", err));
    }, [comp.id, tab, category, subcategoryId]);

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '10px'
        }}>
            <Image src={qrDataUrl} style={{ width: '70px', height: '70px' }} />
        </View >
    )
}