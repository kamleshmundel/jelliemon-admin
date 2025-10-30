import { httpServices } from "../../services/http.service";

const prefix = "common/"

const subjectsServices = {
    getSubjects: async (data: any) => {
        return await httpServices.getData(prefix + "subjects", data)
    },
    addSubjects: async (data: any) => {
        return await httpServices.postData(prefix + "subjects", data)
    },
    deleteSubject: async (data: any) => {
        return await httpServices.deleteData(prefix + "subjects", data)
    },
}

export default subjectsServices