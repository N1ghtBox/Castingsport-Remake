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
import ContestResults from "./pages/Print/ContestResults";
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
          console.log(params)
          return params.contestId
        },
        Component: ContestScoreEditor,
        children: [{
          path: "print",
          Component: ContestResults
        }]
      },
      {
        path: "contestans",
        Component: ContestantTable
      },
      {
        path: "teams",
        Component: ContestantTable
      }
    ],
  },
]);



export default function App() {

  return (
    <RouterProvider router={router} />
  )
}