import { StrictMode, FC, lazy, Suspense } from "react";
import * as ReactDOM from "react-dom/client";
import LandingPage from "./components/LandingPage/LandingPage";

const App: FC = () => {
  return <LandingPage />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
