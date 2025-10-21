import { httpServices } from "../../services/http.service";

const prefix = "admin/"

const questionsServices = {
    getQuestions: async (data: any) => {
        return await httpServices.getData(prefix + "questions", data)
    },
    addQuestion: async (data: any) => {
        // const headers = {  }
        return await httpServices.postData(prefix + "questions", data)
    },
    deleteQuestion: async (data: any) => {
        return await httpServices.deleteData(prefix + "questions", data)
    },
}

export default questionsServices