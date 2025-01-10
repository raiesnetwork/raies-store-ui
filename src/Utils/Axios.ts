import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const createAxiosInstance = () => {
    const token = localStorage.getItem('users');
 
    
    const apiToken = token ? JSON.parse(token)['api_token'] : null;
console.log(apiToken,'token');

    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: apiToken ? 'Bearer ' + apiToken : null
        }
    });
};


export { createAxiosInstance };