import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import React from "react";
import type { RouteObject } from "react-router";
import BaseLayout from "@/layouts/base/BaseLayout";
import { PathProvider } from "../provider";

const Index = () => <div />;

const SeriesList = React.lazy(
	() => import("./../../../pages/SeriesList/series-list"),
);
const CompetitionList = React.lazy(
	() => import("@/pages/CompetitionList/competition-list"),
);

export const BasePaths: RouteObject = {
	path: PathProvider.home,
	Component: BaseLayout,
	errorElement: <ErrorBoundary />,
	children: [
		{
			index: true,
			Component: Index,
		},
		{
			path: PathProvider.menu.competitions,
			loader: ({ params }) => {
				return Number.parseInt(params.year || "0");
			},
			Component: CompetitionList,
		},
		{
			path: PathProvider.menu.series,
			loader: ({ params }) => {
				return Number.parseInt(params.year || "0");
			},
			Component: SeriesList,
		},
	],
};
