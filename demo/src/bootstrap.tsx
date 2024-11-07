import { StrictMode, FC, lazy, Suspense } from "react";
import * as ReactDOM from "react-dom/client";

const HelloWorld = lazy(() => import("remote/HelloWorld"));

const App: FC = () => {
  return (
    <div>
      <Suspense fallback="loading...">
        <HelloWorld />
      </Suspense>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
