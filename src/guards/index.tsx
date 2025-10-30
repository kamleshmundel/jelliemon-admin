import { Navigate } from "react-router-dom";
import { ROUTES, STORAGE_VAR } from "../utils/constants"

const AuthGuard = ({ ele }: { ele: any }) => {
    const token = localStorage.getItem(STORAGE_VAR.ACCESS_TOKEN);
    return token ? <Navigate to={ROUTES.subjects} /> : ele;
}

const PageGuard = ({ ele }: { ele: any }) => {
    const token = localStorage.getItem(STORAGE_VAR.ACCESS_TOKEN);
    return !token ? <Navigate to={ROUTES.login} /> : ele;
}

export {
    AuthGuard, PageGuard
}