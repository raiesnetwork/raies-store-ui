import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const createAxiosInstance = () => {
    const token = localStorage.getItem('kt-auth-react-st');
    const apiToken = token ? JSON.parse(token)['api_token'] : null;

    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: apiToken ? 'Bearer ' + apiToken : null
        }
    });
};


export { createAxiosInstance };