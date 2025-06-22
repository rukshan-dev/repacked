import { RouteObject } from "react-router";
import LandingPage from "./components/LandingPage/LandingPage";
import App from "./App";
import { landingPageLoader } from "./components/LandingPage/loader";

const routes: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: LandingPage,
        loader: landingPageLoader,
      },
      {
        path: "*",
        Component: LandingPage,
        loader: landingPageLoader,
      },
    ],
  },
];

export default routes;
