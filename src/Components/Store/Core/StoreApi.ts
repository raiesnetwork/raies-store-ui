import { createAxiosInstance } from "../../../Utils/Axios";
import { barterOrder, biddingOrder, createOrder, onlinePayment, StoreAddress, updateProfileInfo, userStoreCreate } from "./Interfaces";


const axiosInstance = createAxiosInstance();

// export const getAllProductApi = async (hostName?: string | null) => {
//   try {
//     const { data } = await axiosInstance.get(`/userstore/auth/getall/${hostName}`);
//     return data;
//   } catch (error) {
//     return {
//       error: true,
//       message: "api call faild",
//       data: error,
//     };
//   }
// };
export const AddToCartApi = async (
  productId?: string,
  quantity?: number,
  adminId?: string
) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/cart`, {
      productId,
      quantity,
      adminId,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
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
      data: error,
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
      data: error,
    };
  }
};
export const updateCartApi = async (id: string, quantity: number) => {
  try {
    const { data } = await axiosInstance.put(`/storuser/cart`, {
      id,
      quantity,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const verifyNumberApi = async (mobileNumber: string) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/verify`, {
      mobileNumber,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const registrationVerify = async (mobileNumber: string,hostname:string|null) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/verify-register`, {
      mobileNumber,
      hostname
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
    };
  }
};
export const createStoreUserApi = async (datas: userStoreCreate) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/create`, {
      ...datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const loginUserApi = async (
  mobileNumber: string,
  otp: string,
  subdomain: string
) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/login`, {
      mobileNumber,
      otp,
      subdomain,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const loginWithPasswordApi = async (
  mobileNumber: string,
  password: string,
  subdomain: string|null
) => {
  try {
    
    const response  = await axiosInstance.post(`/userstore/auth/passlogin`, {
      mobileNumber,
      password,
      subdomain,
    });
    console.log("apires",response);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Api call failed",
      data: error,
    };
  }
}; 
export const latestProductApi = async (hostName: string | null,name:string) => {
  try {
    const { data } = await axiosInstance.get(
      `/userstore/auth/latest/${hostName}`,
      {params:{name:name,
      }}
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
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
      data: error,
    };
  }
};
export const createAddressApi = async (datas: StoreAddress) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/address`, {
      ...datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const getAddressApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/storuser/address`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const createOrderApi = async (datas: createOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/order`, { ...datas });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRazorpayOrderApi= async (amount: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/storuser/online-payment`, { amount });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyRazorpayPaymentApi= async(datas:onlinePayment ): Promise<any> => {
  try {
   const {data}= await axiosInstance.post(`/storuser/verify-payment`, { datas  });
   return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const getUserOrderApi = async (subdomain:string|null) => {
  try {
    const { data } = await axiosInstance.get(`/storuser/order/${subdomain}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const createBarterOrderApi = async (datas: barterOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/createbarterorder`, {
      ...datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const createBiddingOrderApi = async (datas: biddingOrder) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/createbiddingorder`, {
      ...datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};


export const getStoreIconApi = async (hostName: string|null) => {
  try {
    const { data } = await axiosInstance.get(
      `/userstore/auth/nameandicon/${hostName}`
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const getProfileInfoApi = async () => {
  try {
    const { data } = await axiosInstance.get(
      `/storuser/profileinfo`
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
export const updateProfileInfoApi = async (datas:updateProfileInfo) => {
  try {
    const { data } = await axiosInstance.put(
      `/storuser/profileinfo`,{...datas}
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
      data: error,
    };
  }
};
