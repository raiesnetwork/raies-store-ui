import { createAxiosInstance } from "../../../Utils/Axios";
import { barterOrder, biddingOrder, createOrder, StoreAddress, userStoreCreate } from "./Interfaces";

const axiosInstance = createAxiosInstance();

export const getAllProductApi = async (hostName?: string|null) => {
  try {
    const {data} = await axiosInstance.get(`/storuser/getall/${hostName}`);
    return data;
  } catch (error) {    
    return {
        error: true,
        message: "api call faild",
        data:error
  
      };
  }
};
export const AddToCartApi = async (productId?: string, quantity?: number,adminId?:string) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/cart`, {
      productId,
      quantity,
      adminId
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
    const { data } = await axiosInstance.get(`/storuser/cart`);
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
    const { data } = await axiosInstance.delete(`/storuser/cart/${id}`);
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
    const { data } = await axiosInstance.put(`/storuser/cart`, { id, quantity });
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
    const { data } = await axiosInstance.post(`/userstore/auth/verify`, { mobileNumber});
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
    const { data } = await axiosInstance.post(`/userstore/auth/create`, { ...datas });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const loginUserApi = async (mobileNumber:string,otp:string) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/login`, { mobileNumber,otp });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const latestProductApi = async (hostName:string|null) => {
  try {
    const { data } = await axiosInstance.get(`/userstore/auth/latest/${hostName}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const DeleteAddressApi = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/storuser/address/${id}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const createAddressApi = async (datas: StoreAddress) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/address`,{...datas});
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const getAddressApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/storuser/address`,);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const createOrderApi = async (datas:createOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/order`,{...datas},);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const getUserOrderApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/storuser/order`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const createBarterOrderApi = async (datas:barterOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/createbarterorder`, { ...datas });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
export const createBiddingOrderApi = async (datas:biddingOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/createbiddingorder`, { ...datas });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};