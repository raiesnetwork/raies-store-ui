import { createAxiosInstance } from "../../../Utils/Axios";

const axiosInstance = createAxiosInstance();

export const getAllProductApi = async (id?: string) => {
  try {
    const {data} = await axiosInstance.get(`/store/viewall/${id}`);
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
    const { data } = await axiosInstance.post(`/store/cart`, {
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
    const { data } = await axiosInstance.get(`/store/cart`);
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
    const { data } = await axiosInstance.delete(`/store/cart/${id}`);
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
    const { data } = await axiosInstance.put(`/store/cart`, { id, quantity });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data:error

    };
  }
};
