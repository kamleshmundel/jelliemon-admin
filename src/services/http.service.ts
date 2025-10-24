import axios from 'axios';
// import { ROUTES } from '@/shared/utils/routes';
import { ROUTES, STORAGE_VAR } from '../utils/constants';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl);

type headerType = { [key: string]: string };
const defaultHeaders = { 'Content-Type': 'application/json' };

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: defaultHeaders,
});

const getAccessToken = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_VAR.ACCESS_TOKEN);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response?.data;
    },
    (error) => {
        if ([401, 403].includes(error?.response?.status)) {
            localStorage.clear();
            window.location.replace(ROUTES.login);
        }

        const errorMessage = error?.response?.data || error?.message || 'An error occurred';
        return Promise.reject(errorMessage);
    }
);

export const httpServices = {
    getData: async (reqUrl: string, params = {}) => {
        try {
            const response = await axiosInstance.get(reqUrl, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    postData: async (reqUrl: string, data = {}, headers?: headerType) => {
        try {
            const response = await axiosInstance.post(reqUrl, data, {
                headers: { ...defaultHeaders, ...headers }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    putData: async (reqUrl: string, data = {}, headers?: headerType) => {
        try {
            const response = await axiosInstance.put(reqUrl, data, {
                headers: { ...defaultHeaders, ...headers }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteData: async (reqUrl: string, params = {}) => {
        try {
            const response = await axiosInstance.delete(reqUrl, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },
};