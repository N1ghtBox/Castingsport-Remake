import React from "react";
import type { RouteObject } from "react-router";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import CompetitionLayout from "@/layouts/competition/CompetitionLayout";
import DebugView from "@/pages/Competitions/Debug/DebugView";
import { PathProvider } from "../provider";

const TeamProvider = React.lazy(
	() => import("./../../../layouts/team/TeamLayout"),
);
const CompetitionActions = React.lazy(
	() => import("./../../../pages/Tools/CompetitionActions"),
);
const ContestLayout = React.lazy(
	() => import("./../../../layouts/contest/ContestLayout"),
);
const ContestantTable = React.lazy(() =>
	import("./../../../pages/Competitions/ContestantList/index").then((m) => ({
		default: m.ContestantList,
	})),
);
const TeamSummaryTable = React.lazy(() =>
	import("./../../../pages/Competitions/TeamSummaryList/index").then((m) => ({
		default: m.TeamSummaryTable,
	})),
);
const TeamsTable = React.lazy(() =>
	import("./../../../pages/Competitions/TeamList/index").then((m) => ({
		default: m.TeamTable,
	})),
);
const ThlonLayout = React.lazy(
	() => import("../../../layouts/thlon/ThlonLayout"),
);
const ThlonSummaryTable = React.lazy(() =>
	import("./../../../pages/Competitions/Summary/index").then((m) => ({
		default: m.CompetitionSummary,
	})),
);
const TimelineGenerate = React.lazy(
	() => import("./../../../pages/Tools/Timeline"),
);
const ContestResults = React.lazy(
	() => import("./../../../pages/Print/ContestPrint/ContestResults"),
);
const ThlonResults = React.lazy(
	() => import("./../../../pages/Print/SummaryPrint/ThlonResults"),
);
const TeamResults = React.lazy(
	() => import("./../../../pages/Print/TeamPrint/TeamResults"),
);
const ContestScoreEditor = React.lazy(
	() => import("./../../../pages/ContestScoreEditor"),
);
const ScoreGenerate = React.lazy(
	() => import("./../../../pages/Tools/ScoreTable"),
);

export const CompetitionPaths: RouteObject = {
	path: PathProvider.competition.baseRouterPath,
	loader: ({ params }) => {
		return params.competition;
	},
	Component: CompetitionLayout,
	errorElement: React.createElement(ErrorPage),
	children: [
		{
			index: true,
			Component: CompetitionActions,
		},
		{
			path: PathProvider.competition.timeline,
			Component: TimelineGenerate,
		},
		{
			path: PathProvider.competition.debug,
			Component: DebugView,
		},
		{
			path: PathProvider.competition.scoreTable,
			Component: ScoreGenerate,
		},
		{
			path: PathProvider.competition.contestRouterPath,
			Component: ContestLayout,
			loader: ({ params }) => {
				return Number.parseInt(params.contestId || "0");
			},
			children: [
				{
					index: true,
					Component: ContestScoreEditor,
				},
				{
					path: PathProvider.print,
					Component: ContestResults,
				},
			],
		},
		{
			path: PathProvider.competition.contestants,
			Component: ContestantTable,
		},
		{
			path: PathProvider.competition.teams,
			Component: TeamProvider,
			children: [
				{
					index: true,
					Component: TeamsTable,
				},
				{
					path: PathProvider.competition.teamsSummary,
					Component: TeamSummaryTable,
				},
				{
					path: PathProvider.competition.teamsSummaryPrint,
					Component: TeamResults,
				},
			],
		},
		{
			path: PathProvider.competition.summaryRouterPath,
			Component: ThlonLayout,
			loader: ({ params }) => {
				return {
					from: Number.parseInt(params.from || "0"),
					to: Number.parseInt(params.to || "0"),
				};
			},
			children: [
				{
					index: true,
					Component: ThlonSummaryTable,

				},
				{
					path: PathProvider.print,
					Component: ThlonResults
				},
			],
		},
	],
};
