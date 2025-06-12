import {
  RouterProvider,
  createHashRouter,
} from "react-router";
import "./App.css";
import Layout from "./BaseLayout";
import CompetitionLayout from "./CompetitionLayout";
import ContestantTable from "./components/ContestantTable/table";
import ContestScoreEditor from "./components/ContestScoreEditor";
import CompetitionList from "./components/CompetitionList/competition-list";
import 'moment/dist/locale/pl'
import ContestResults from "./pages/Print/ContestPrint/ContestResults";
import ThlonSummaryTable from "./components/ThlonSummary/table";
import ThlonResults from "./pages/Print/SummaryPrint/ThlonResults";
const Index = () => (<div />)

const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
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
      }]
  },
  {
    path: "competition/:competition",
    loader: ({ params }) => {
      return params.competition
    },
    Component: CompetitionLayout,
    children: [
      {
        index: true,
        Component: Index
      },
      {
        path: "contest/:contestId",
        loader: ({ params }) => {
          return params.contestId
        },
        Component: ContestScoreEditor
      },
      {
        path: "contestans",
        Component: ContestantTable
      },
      {
        path: "teams",
        Component: ContestantTable
      },
      {
        path: "summary/:from/:to",
        loader: ({ params }) => {
          return {
            from: Number.parseInt(params.from || "0"),
            to: Number.parseInt(params.to || "0")
          }
        },
        Component: ThlonSummaryTable
      }
    ],
  },
  {
    path: "competition/:competition/contest/:contestId/print",
    Component: ContestResults,
    loader: ({ params, }) => {
      return {
        competition: params.competition,
        contestId: params.contestId
      }
    }
  },
  {
    path: "competition/:competition/summary/:from/:to/print",
    Component: ThlonResults,
    loader: ({ params, }) => {
      return {
        competition: params.competition,
        from: Number.parseInt(params.from || "0"),
        to: Number.parseInt(params.to || "0")
      }
    }
  }
]);



export default function App() {

  return (
    <RouterProvider router={router} />
  )
}