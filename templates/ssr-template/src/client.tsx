import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import routes from './routes';

const browserRoutes = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

hydrateRoot(
  document,
  <StrictMode>
    <RouterProvider router={browserRoutes} />
  </StrictMode>
);

declare global {
  interface Window {
    __staticRouterHydrationData: any;
  }
}