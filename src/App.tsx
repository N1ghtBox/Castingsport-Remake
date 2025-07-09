import { Font } from "@react-pdf/renderer";
import { ConfigProvider, theme } from "antd";
import locale from 'antd/locale/pl_PL';
import dayjs from 'dayjs';
import 'moment/dist/locale/pl';
import {
  RouterProvider,
  createHashRouter,
  useRouteError
} from "react-router";
import "./App.css";
import Layout from "./BaseLayout";
import CompetitionLayout from "./CompetitionLayout";
import TeamProvider from "./TeamProvider";
import CompetitionActions from "./components/CompetitionActions";
import CompetitionList from "./components/CompetitionList/competition-list";
import ContestLayout from "./components/ContestLayout";
import ContestScoreEditor from "./components/ContestScoreEditor";
import ContestantTable from "./components/ContestantTable/table";
import TeamSummaryTable from "./components/TeamSummaryList/table";
import TeamsTable from "./components/TeamsList/table";
import ThlonProvider from "./components/ThlonProvider";
import ThlonSummaryTable from "./components/ThlonSummary/table";
import TimelineGenerate from "./pages/Generate/Timeline";
import ContestResults from "./pages/Print/ContestPrint/ContestResults";
import ThlonResults from "./pages/Print/SummaryPrint/ThlonResults";
import TeamResults from "./pages/Print/TeamPrint/TeamResults";

import 'dayjs/locale/pl';
import ScoreGenerate from "./pages/Generate/ScoreTable";
import SeriesList from "./components/SeriesList/series-list";
import SerieLayout from "./SerieLayout";

dayjs.locale('pl');

Font.registerHyphenationCallback((word) => [word]);
// Register Font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 'normal',
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 'bold',
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: 'italic',
    }
  ]
});

const Index = () => (<div />)

const { darkAlgorithm } = theme;

const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: Index
      },
      {
        path: "competitions/:year",
        loader: ({ params }) => {
          return Number.parseInt(params.year || "0")
        },
        Component: CompetitionList
      },
      {
        path: "series/:year",
        loader: ({ params }) => {
          return Number.parseInt(params.year || "0")
        },
        Component: SeriesList
      },
    ]
  },
  //Serie route
  {
    path: "serie/:serie",
    loader: ({ params }) => {
      return { serie: params.serie }
    },
    Component: SerieLayout,

  },
  //Competition routes
  {
    path: "competition/:competition",
    loader: ({ params }) => {
      return params.competition
    },
    Component: CompetitionLayout,
    children: [
      {
        index: true,
        Component: CompetitionActions
      },
      {
        path: 'timeline',
        Component: TimelineGenerate
      },
      {
        path: 'scoreTable',
        Component: ScoreGenerate
      },
      {
        path: "contest/:contestId",
        Component: ContestLayout,
        loader: ({ params }) => {
          return Number.parseInt(params.contestId || "0")
        },
        children: [
          {
            index: true,
            Component: ContestScoreEditor,
            loader: ({ params }) => {
              return Number.parseInt(params.contestId || "0")
            },
          },
          {
            path: "print",
            Component: ContestResults,
            loader: ({ params, }) => {
              return {
                competition: params.competition,
                contestId: params.contestId
              }
            }
          },
        ]
      },
      {
        path: "contestants",
        Component: ContestantTable
      },
      {
        path: "teams",
        Component: TeamProvider,
        children: [
          {
            index: true,
            Component: TeamsTable
          },
          {
            path: 'summary',
            Component: TeamSummaryTable,
          },
          {
            path: 'summary/print',
            Component: TeamResults
          }
        ]
      },
      {
        path: "summary/:from/:to",
        Component: ThlonProvider,
        loader: ({ params }) => {
          return {
            from: Number.parseInt(params.from || "0"),
            to: Number.parseInt(params.to || "0")
          }
        },
        children: [
          {
            index: true,
            Component: ThlonSummaryTable,
            loader: ({ params }) => {
              return {
                from: Number.parseInt(params.from || "0"),
                to: Number.parseInt(params.to || "0")
              }
            },
          },
          {
            path: "print",
            Component: ThlonResults,
            loader: ({ params }) => {
              return {
                competition: params.competition,
                from: Number.parseInt(params.from || "0"),
                to: Number.parseInt(params.to || "0")
              }
            },
          },
        ]
      }
    ],
  }
]);


export default function App() {

  return (
    <ConfigProvider theme={{
      token: {
        colorBgContainer: 'rgba(37, 37, 37, 1)'
      },
      algorithm: darkAlgorithm,
      cssVar: true
    }} locale={locale}>

      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  if (error instanceof Error)
    return <div>
      <span>{error.name}</span>
      <span>{error.message}</span>
      <span>{error.stack}</span>
    </div>
  return <div>Wystąpił nieoczekiwany błąd</div>;
}
