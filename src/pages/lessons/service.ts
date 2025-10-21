import { httpServices } from "../../services/http.service";

const prefix = "common/"

const lessonsServices = {
    getLessons: async (data: any) => {
        return await httpServices.getData(prefix + "lessons", data)
    },
    addLessons: async (data: any) => {
        return await httpServices.postData(prefix + "lessons", data)
    },
    deleteLessons: async (data: any) => {
        return await httpServices.deleteData(prefix + "lessons", data)
    },
}

export default lessonsServices