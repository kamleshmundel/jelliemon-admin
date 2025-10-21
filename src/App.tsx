import { useRoutes } from "react-router-dom";
import { ContentLayout, FullLayout } from "./layouts";
import { APP_ROUTES } from "./pages/routes";

export default function App() {
  return useRoutes([
    {
      path: 'auth', element: <FullLayout />,
      children: APP_ROUTES.AUTH_ROUTES
    },
    {
      path: '', element: <ContentLayout />,
      children: APP_ROUTES.PAGE_ROUTES
    }
  ])
}