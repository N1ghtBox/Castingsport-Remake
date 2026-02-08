import React from "react";
import { Outlet, type RouteObject } from "react-router";

const SerieLayout = React.lazy(
	() => import("../../../layouts/serie/SerieLayout"),
);

import SerieResults from "./../../../pages/Print/SeriePrint/SerieResults";
import SerieTeamResults from "./../../../pages/Print/SeriePrint-Team/SerieTeamResults";
import SerieResultTable from "./../../../pages/SerieResultList/table";
import SerieTeamResultTable from "./../../../pages/SerieTeamResultList/table";
import { PathProvider } from "../provider";

export const SeriesPaths: RouteObject = {
	path: PathProvider.serie.baseRouterPath,
	loader: ({ params }) => {
		return { serie: params.serie };
	},
	Component: SerieLayout,
	children: [
		{
			path: PathProvider.serie.teams,
			Component: Outlet,
			children: [
				{
					index: true,
					Component: SerieTeamResultTable,
				},
				{
					path: PathProvider.print,
					Component: SerieTeamResults,
				},
			],
		},
		{
			path: PathProvider.serie.summaryRouterPath,
			Component: Outlet,
			children: [
				{
					index: true,
					Component: SerieResultTable,
					loader: ({ params }) => {
						return {
							from: Number.parseInt(params.from || "0"),
							to: Number.parseInt(params.to || "0"),
						};
					},
				},
				{
					path: PathProvider.print,
					Component: SerieResults,
					loader: ({ params }) => {
						return {
							from: Number.parseInt(params.from || "0"),
							to: Number.parseInt(params.to || "0"),
						};
					},
				},
			],
		},
	],
};
