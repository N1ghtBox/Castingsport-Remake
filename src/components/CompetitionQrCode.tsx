import { Image, View } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { useEffect, useState } from "react";
import { Competition } from "@/types/Competition";

export default function CompetitionQrCode({ comp }: { comp: Competition }) {
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        QRCode.toDataURL(`https://castingsport-result-web.vercel.app/competition/${comp.id.trim()}`)
            .then(url => setQrDataUrl(url))
            .catch(err => console.error(err));
    }, [comp.id]);

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