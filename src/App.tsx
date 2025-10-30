import { useRoutes } from "react-router-dom";
import { ContentLayout, FullLayout } from "./layouts";
import { APP_ROUTES } from "./pages/routes";
import { AuthGuard, PageGuard } from "./guards";

export default function App() {
  return useRoutes([
    {
      path: 'auth', element: <AuthGuard ele={<FullLayout />} />,
      children: APP_ROUTES.AUTH_ROUTES
    },
    {
      path: '', element: <PageGuard ele={<ContentLayout />} />,
      children: APP_ROUTES.PAGE_ROUTES
    }
  ])
}