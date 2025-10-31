import { httpServices } from "../../services/http.service";

const prefix = "admin/"

const questionsServices = {
    getQuestions: async (data: any) => {
        return await httpServices.getData(prefix + "questions", data)
    },
    addQuestion: async (data: any) => {
        const headers: any = { "Content-Type": "multipart/form-data" };
        return await httpServices.postData(prefix + "questions", data, headers)
    },
    updateQuestion: async (data: any) => {
        const headers: any = { "Content-Type": "multipart/form-data" };
        return await httpServices.putData(prefix + "questions", data, headers)
    },
    deleteQuestion: async (data: any) => {
        return await httpServices.deleteData(prefix + "questions", data)
    },
}

export default questionsServices