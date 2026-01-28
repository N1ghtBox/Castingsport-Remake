import { Font } from "@react-pdf/renderer";
import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "moment/dist/locale/pl";
import {
	createHashRouter,
	Outlet,
	RouterProvider,
	useNavigate,
	useRouteError,
} from "react-router";
import "./App.css";
import Layout from "./BaseLayout";
import CompetitionLayout from "./CompetitionLayout";
import CompetitionList from "./pages/CompetitionList/competition-list";

import "dayjs/locale/pl";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Button } from "./components/ui/button";
import SerieResults from "./pages/Print/SeriePrint/SerieResults";
import SerieTeamResults from "./pages/Print/SeriePrint-Team/SerieTeamResults";
import SerieResultTable from "./pages/SerieResultList/table";
import SerieTeamResultTable from "./pages/SerieTeamResultList/table";

const TeamProvider = React.lazy(() => import("./TeamProvider"));
const CompetitionActions = React.lazy(
	() => import("./pages/CompetitionActions"),
);
const ContestLayout = React.lazy(() => import("./pages/ContestLayout"));
const ContestantTable = React.lazy(
	() => import("./pages/Competitions/ContestantList/index").then(m => ({ default: m.ContestantList })),
);
const TeamSummaryTable = React.lazy(
	() => import("./pages/TeamSummaryList/table"),
);
const TeamsTable = React.lazy(() => import("./pages/TeamsList/table"));
const ThlonProvider = React.lazy(() => import("./pages/ThlonProvider"));
const ThlonSummaryTable = React.lazy(
	() => import("./pages/ThlonSummary/table"),
);
const TimelineGenerate = React.lazy(() => import("./pages/Tools/Timeline"));
const ContestResults = React.lazy(
	() => import("./pages/Print/ContestPrint/ContestResults"),
);
const ThlonResults = React.lazy(
	() => import("./pages/Print/SummaryPrint/ThlonResults"),
);
const TeamResults = React.lazy(
	() => import("./pages/Print/TeamPrint/TeamResults"),
);
const ContestScoreEditor = React.lazy(
	() => import("./pages/ContestScoreEditor"),
);
const ScoreGenerate = React.lazy(() => import("./pages/Tools/ScoreTable"));
const SeriesList = React.lazy(() => import("./pages/SeriesList/series-list"));
const SerieLayout = React.lazy(() => import("./SerieLayout"));

dayjs.locale("pl");

Font.registerHyphenationCallback((word) => [word]);
// Register Font
Font.register({
	family: "Roboto",
	fonts: [
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
			fontWeight: "normal",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
			fontWeight: "bold",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
			fontStyle: "italic",
		},
	],
});

const Index = () => <div />;

const { darkAlgorithm } = theme;

const router = createHashRouter([
	{
		path: "/",
		Component: Layout,
		errorElement: <ErrorBoundary />,
		children: [
			{
				index: true,
				Component: Index,
			},
			{
				path: "competitions/:year",
				loader: ({ params }) => {
					return Number.parseInt(params.year || "0");
				},
				Component: CompetitionList,
			},
			{
				path: "series/:year",
				loader: ({ params }) => {
					return Number.parseInt(params.year || "0");
				},
				Component: SeriesList,
			},
		],
	},
	//Serie route
	{
		path: "serie/:serie",
		loader: ({ params }) => {
			return { serie: params.serie };
		},
		Component: SerieLayout,
		children: [
			{
				path: "summary/teams",
				Component: Outlet,
				children: [
					{
						index: true,
						Component: SerieTeamResultTable,
					},
					{
						path: "print",
						Component: SerieTeamResults,
					},
				],
			},
			{
				path: "summary/:from/:to",
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
						path: "print",
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
	},
	//Competition routes
	{
		path: "competition/:competition",
		loader: ({ params }) => {
			return params.competition;
		},
		Component: CompetitionLayout,
		children: [
			{
				index: true,
				Component: CompetitionActions,
			},
			{
				path: "timeline",
				Component: TimelineGenerate,
			},
			{
				path: "scoreTable",
				Component: ScoreGenerate,
			},
			{
				path: "contest/:contestId",
				Component: ContestLayout,
				loader: ({ params }) => {
					return Number.parseInt(params.contestId || "0");
				},
				children: [
					{
						index: true,
						Component: ContestScoreEditor,
						loader: ({ params }) => {
							return Number.parseInt(params.contestId || "0");
						},
					},
					{
						path: "print",
						Component: ContestResults,
						loader: ({ params }) => {
							return Number.parseInt(params.contestId || "0");
						},
					},
				],
			},
			{
				path: "contestants",
				Component: ContestantTable,
			},
			{
				path: "teams",
				Component: TeamProvider,
				children: [
					{
						index: true,
						Component: TeamsTable,
					},
					{
						path: "summary",
						Component: TeamSummaryTable,
					},
					{
						path: "summary/print",
						Component: TeamResults,
					},
				],
			},
			{
				path: "summary/:from/:to",
				Component: ThlonProvider,
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
						loader: ({ params }) => {
							return {
								from: Number.parseInt(params.from || "0"),
								to: Number.parseInt(params.to || "0"),
							};
						},
					},
					{
						path: "print",
						Component: ThlonResults,
						loader: ({ params }) => {
							return {
								competition: params.competition,
								from: Number.parseInt(params.from || "0"),
								to: Number.parseInt(params.to || "0"),
							};
						},
					},
				],
			},
		],
	},
]);

export default function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorBgContainer: "rgba(37, 37, 37, 1)",
				},
				algorithm: darkAlgorithm,
				cssVar: true,
			}}
			locale={locale}>
			<RouterProvider router={router} />
		</ConfigProvider>
	);
}

function ErrorBoundary() {
	const error = useRouteError();
	const navigate = useNavigate();
	console.error(error);
	// Uncaught ReferenceError: path is not defined
	if (error instanceof Error)
		return (
			<div>
				<span>{error.name}</span>
				<span>{error.message}</span>
				<span>{error.stack}</span>
			</div>
		);
	return (
		<div>
			<Button
				variant={"outline"}
				onClick={() => navigate(-1)}>
				<ChevronLeft /> Wróć
			</Button>
			Wystąpił nieoczekiwany błąd
		</div>
	);
}
