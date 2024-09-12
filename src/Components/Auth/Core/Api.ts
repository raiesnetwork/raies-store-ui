import { createAxiosInstance } from "../../../Utils/Axios";

const axiosInstance = createAxiosInstance();

export const AuthCheckApi = async () => {
  try {
    const {data} = await axiosInstance.get(`/userstore/auth`);
    return data;
  } catch (error) {    
    return {
        error: true,
        message: error,
        data:false
  
      };
  }
};