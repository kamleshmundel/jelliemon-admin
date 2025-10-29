import { httpServices } from "../../services/http.service";

const prefix = "common/"

const unitsServices = {
    getUnits: async (data: any) => {
        return await httpServices.getData(prefix + "units", data)
    },
    addUnits: async (data: any) => {
        const headers: any = { "Content-Type": "multipart/form-data" };

        return await httpServices.postData(prefix + "units", data, headers)
    },
    deleteUnit: async (data: any) => {
        return await httpServices.deleteData(prefix + "units", data)
    },
}

export default unitsServices