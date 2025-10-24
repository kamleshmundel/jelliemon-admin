import { httpServices } from "../../services/http.service";

const prefix = "common/"

const unitsServices = {
    getUnits: async (data: any) => {
        return await httpServices.getData(prefix + "units", data)
    },
    addUnits: async (data: any) => {
        return await httpServices.postData(prefix + "units", data)
    },
    deleteUnit: async (data: any) => {
        return await httpServices.deleteData(prefix + "units", data)
    },
}

export default unitsServices