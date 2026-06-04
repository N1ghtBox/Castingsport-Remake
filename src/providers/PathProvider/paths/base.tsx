import React from "react";
import type { RouteObject } from "react-router";
import GeneralListsLayout from "@/layouts/generalLists/GeneralListsLayout";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import { PathProvider } from "../provider";

const Index = () => <div />;

const SeriesList = React.lazy(
	() => import("./../../../pages/SeriesList/series-list"),
);
const CompetitionList = React.lazy(
	() => import("@/pages/CompetitionList/competition-list"),
);
const SettingsPage = React.lazy(
	() => import("@/pages/Settings/SettingsPage"),
);

export const BasePaths: RouteObject = {
	path: PathProvider.home,
	Component: GeneralListsLayout,
	errorElement: <ErrorPage />,
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
		{
			path: PathProvider.menu.settings,
			Component: SettingsPage,
		},
	],
};
