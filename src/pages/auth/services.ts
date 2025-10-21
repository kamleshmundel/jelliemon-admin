import { httpServices } from "../../services/http.service";

const prefix = "admin/auth/"

const authServices = {
    login: async (data: any) => {
        return await httpServices.postData(prefix + "login", data)
    },
}

export default authServices