import { AUTH_ROUTES } from "./auth/routes";
import NotFound from "./NotFound";
import Dashboard from "./dashboard";
import Users from "./users";
import Subjects from "./subjects";
import Lessions from "./lessons";
import Units from "./units";
import Questions from "./questions";
import { Outlet } from "react-router-dom";
import AddQue from "./questions/AddQue";

const PAGE_ROUTES = [
    { path: "", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "subjects", element: <Subjects /> },
    { path: "units", element: <Units /> },
    { path: "lessons", element: <Lessions /> },
    {
        path: "questions", element: <Outlet />,
        children: [
            { path: '', element: <Questions /> },
            { path: 'add-edit', element: <AddQue /> },
        ]
    },
    { path: "*", element: <NotFound /> },

]

export const APP_ROUTES = { AUTH_ROUTES, PAGE_ROUTES }