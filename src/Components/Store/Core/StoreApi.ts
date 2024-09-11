import { createAxiosInstance } from "../../../Utils/Axios";
import { userStoreCreate } from "./Interfaces";

const axiosInstance = createAxiosInstance();

export const getAllProductApi = async (hostName?: string) => {
  try {
    const {data} = await axiosInstance.get(`/userstore/viewall/${hostName}`);
    return data;
  } catch (error) {    
    return {
        error: true,
        message: "api call faild",
        data:error
  
      };
  }
};
export const AddToCartApi = async (productId?: string, quantity?: number) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/cart`, {
      productId,
      quantity,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const FetchToCartApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/userstore/cart`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error
    };
  }
};
export const DeleteCartApi = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/userstore/cart/${id}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const updateCartApi = async (id: string, quantity: number) => {
  try {
    const { data } = await axiosInstance.put(`/userstore/cart`, { id, quantity });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const verifyNumberApi = async (mobileNumber:string) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/verify`, { mobileNumber});
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const createStoreUserApi = async (datas:userStoreCreate) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/create`, { ...datas });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const loginUserApi = async (mobileNumber:string) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/login`, { mobileNumber });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
