import { Image, View } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { useEffect, useState } from "react";
import { Competition } from "@/types/Competition";

export type QrCodeProps = {
    comp: Competition
    tab: string,
    category: string
}

export default function CompetitionQrCode({ comp, tab, category }: QrCodeProps) {
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        QRCode.toDataURL(`https://castingsport-result-web.vercel.app/competition/${comp.id.trim()}?tab=${tab}&category=${category}`)
            .then(url => setQrDataUrl(url))
            .catch(err => console.error(err));
    }, [comp.id, tab, category]);

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