import NotFound from "../NotFound";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";

export const AUTH_ROUTES = [
    { path: "login", element: <Login /> },
    { path: "forget-password", element: <ForgotPassword /> },
    { path: "*", element: <NotFound /> },

]