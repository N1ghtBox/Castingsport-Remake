import type { LucideProps } from "lucide-react";

export type Tab = {
    title: string;
    url: string;
};

export type Item = {
    title: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    tabs: Array<Tab>;
};
