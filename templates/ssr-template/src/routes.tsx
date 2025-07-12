import { RouteObject } from "react-router";
import LandingPage from "./components/LandingPage/LandingPage";
import App from "./App";
import { landingPageLoader } from "./components/LandingPage/loader";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <LandingPage />,
        loader: landingPageLoader,
      },
      {
        path: "*",
        element: <LandingPage />,
        loader: landingPageLoader,
      },
    ],
  },
];

export default routes;
