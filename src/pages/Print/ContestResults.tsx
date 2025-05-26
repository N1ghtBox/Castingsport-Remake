import { Button } from "@/components/ui/button";
import { usePDF } from 'react-to-pdf';

export default function ContestResults() {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    return (<>
        <div className="h-[5vh]">
            <Button onClick={() => history.back()}>Back</Button>
            <Button onClick={() => toPDF()}>Print</Button>
        </div>
        <div className="print-page flex">
            <div id="page" style={{ display: "flex", flexDirection: "column", gap:'50px', flex: 1 }} ref={targetRef}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ height: "100px" }}>
                        <img src="" alt="" style={{ maxHeight: "100%" }} />
                    </span>
                    <span style={{
                        marginRight: "5%",
                        width: '90%'
                    }}>
                        <h3
                            style={{
                                paddingBottom: "15px",
                                borderBottom: "4px solid black",
                                marginBottom: "5px",
                                textAlign: "center",
                                fontSize: '2rem'
                            }}
                        >
                            II RZUTOWY PUCHAR POLSKI POD PATRONATEM BURMISTRZA ŚREMU
                        </h3>
                        <h6 style={{ marginTop: "0px", textAlign: "center", fontSize: '1.5rem' }}>30-2 Lipiec 2023 r.</h6>
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                        style={{
                            backgroundColor: "aqua",
                            height: "fit-content",
                            padding: "10px 50px",
                            marginLeft: "15%",
                            fontWeight: 800,
                            fontSize: '2rem'
                        }}
                    >
                        Junior
                    </div>
                    <span style={{ marginRight: "5%" }}>
                        <h3
                            style={{
                                paddingBottom: "15px",
                                borderBottom: "4px solid black",
                                paddingInline: "40px",
                                fontSize: '2rem'
                            }}
                        >
                            Konkurencja 1
                        </h3>
                        <p style={{
                            marginTop: "0px",
                            textAlign: "center",
                            fontSize: '2rem'
                        }}>Mucha cel</p>
                    </span>
                </div>

                <div>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "11px",
                            borderBottom: "2px solid black"
                        }}
                    >
                        <thead style={{ fontSize: '1.8rem' }}>
                            <tr>
                                <th>Zajęte miejsce</th>
                                <th>Nr. startowy</th>
                                <th>Imię i nazwisko</th>
                                <th>Okręg/Klub</th>
                                <th>Wynik</th>
                                <th>Czas</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: "center", fontSize: '1.5rem' }}>
                            {[
                                ["1", "26", "Kamil Szołtysik", "Okręg PZW w Katowice", "90", "4.23.44"],
                                ["2", "27", "Bartosz Mirek", "Okręg PZW w Katowice", "85", "4.13.03"],
                                ["3", "30", "Dawid Szufrajda", "Okręg PZW w Bydgoszczy", "85", "127.500"],
                                ["4", "31", "Filip Sala", "Okręg PZW w Kielcach", "75", "3.53.00"],
                                ["5", "29", "Mateusz Molisa", "Okręg PZW w Kielcach", "70", "3.22.50"],
                                ["6", "32", "Kamil Żebranowicz", "Okręg PZW w Toruniu", "50", "4.02.71"],
                                ["7", "28", "Krystian Banaś", "Okręg PZW w Toruniu", "0", "0.000"]
                            ].map(([place, number, name, club, score, time]) => (
                                <tr key={number}>
                                    <td style={{ fontWeight: 900, paddingBlock: "10px" }}>{place}</td>
                                    <td>{number}</td>
                                    <td>{name}</td>
                                    <td>{club}</td>
                                    <td>{score}</td>
                                    <td>{time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "15px",
                            marginInline: "15px"
                        }}
                    >
                        <span style={{ fontSize: "1.5rem" }}>
                            Sędzia główny<br />
                            <br />
                            Renata Pietrunko
                        </span>
                        <span style={{ fontSize: "1.5rem" }}>24. maj 2025, 23:20</span>
                        <span style={{ fontSize: "1.5rem" }}>
                            Sędzia sekretarz<br />
                            <br />
                            Kinga Telenga
                        </span>
                    </div>
                </div>
            </div>
        </div>

    </>)
}