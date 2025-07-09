import { MenuListContext } from "@/BaseLayout";
import AddIcon from '@mui/icons-material/Add';
import { useContext, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import SeriesCard from "../ui/series-card";
import SeriesForm from "../ui/series-form";

export default function SeriesList() {
    const year = useLoaderData<number>();
    const { series } = useContext(MenuListContext)
    const navigate = useNavigate()

    function AfterCreate(id: string) {
        navigate(`/serie/${id}`)
    }

    const filteredSeries = useMemo(() => {
        return series.filter(x => {
            return x.year === year
        })
    }, [year, series])

    return (
        <>
            <span className="m-[12px] flex gap-1.5">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button color="primary">
                            <AddIcon />
                            Dodaj
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Utwórz zawody</DialogTitle>
                        </DialogHeader>
                        <SeriesForm callback={AfterCreate} />
                    </DialogContent>
                </Dialog>
            </span>
            <div className=" grid grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-[15px]">
                {[...filteredSeries]
                    .map(series => { return (<SeriesCard key={series.id} series={series} />); })}
            </div>
        </>
    )
}