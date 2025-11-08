import { httpServices } from "../../services/http.service";

const prefix = "common/";
const prefixAdm = "admin/";

const uploadServices = {
  addSubjects: async (data: any) => {
    return await httpServices.postData(prefix + "subjects", data);
  },
  addLessons: async (data: any) => {
    return await httpServices.postData(prefix + "lessons", data);
  },
  addUnits: async (data: any) => {
    const headers: any = { "Content-Type": "multipart/form-data" };
    return await httpServices.postData(prefix + "units", data, headers);
  },
  addQuestion: async (data: any) => {
    const headers: any = { "Content-Type": "multipart/form-data" };
    return await httpServices.postData(prefixAdm + "questions", data, headers);
  },
};

export default uploadServices;
