import { createAxiosInstance, createAxiosInstanceForProduct } from "../../../Utils/Axios";
import {
  barterOrder,
  biddingOrder,
  createOrder,
  onlinePayment,
  StoreAddress,
  updateProfileInfo,
  userStoreCreate,
} from "./Interfaces";
import axios from "axios";
const axiosInstance = createAxiosInstance();
const axiosInstance2 = createAxiosInstanceForProduct();

// export const getAllProductApi = async (hostName?: string | null) => {
//   try {
//     const { data } = await axiosInstance.get(`/userstore/auth/getall/${hostName}`);
//     return data;
//   } catch (error) {
//     return {
//       error: true,
//       message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const registrationVerify = async (
  mobileNumber: string,
  hostname: string | null
) => {
  try {
    const { data } = await axiosInstance.post(
      `/userstore/auth/verify-register`,
      {
        mobileNumber,
        hostname,
      }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const loginUserApi = async (
  mobileNumber: string,
  otp: string,
  subdomain: string,
  userType: string
) => {
  try {
    const { data } = await axiosInstance.post(`/userstore/auth/login`, {
      mobileNumber,
      otp,
      subdomain,
      userType
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const loginWithPasswordApi = async (
  mobileNumber: string,
  password: string,
  subdomain: string | null,
  userType:string
) => {
  try {
    const response = await axiosInstance.post(`/userstore/auth/passlogin`, {
      mobileNumber,
      password,
      subdomain,
      userType
    });
    console.log("apires", response);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Api call failed",
      data: error,
    };
  }
};
export const latestProductApi = async (
  hostName: string | null,
  name: string
) => {
  try {
    const { data } = await axiosInstance2.get(
      `/userstore/auth/latest/${hostName}`,
      { params: { name: name } }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRazorpayOrderApi = async (amount: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/storuser/online-payment`, {
      amount,
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyRazorpayPaymentApi = async (
  datas: onlinePayment
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(`/storuser/verify-payment`, {
      datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const getUserOrderApi = async (subdomain: string | null) => {
  try {
    const { data } = await axiosInstance.get(`/storuser/order/${subdomain}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
}; export const getInventoryApi = async (subdomain: string | null) => {
  try {
    const { data } = await axiosInstance.get(`/storuser/inventory/${subdomain}`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
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
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};

export const getStoreIconApi = async (hostName: string | null) => {
  try {
    const { data } = await axiosInstance2.get(
      `/userstore/auth/nameandicon/${hostName}`
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const getProfileInfoApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/storuser/profileinfo`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const updateProfileInfoApi = async (datas: updateProfileInfo) => {
  try {
    const { data } = await axiosInstance.put(`/storuser/profileinfo`, {
      ...datas,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const verifyMailApi = async (email: string) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/verifymail`, {
      email,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const updateMailApi = async (email: string, otp: string) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/updatemail`, {
      email,
      otp,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const updateMobileNumberApi = async (
  mobileNumber: string,
  otp: string,
  hostName: string | null
) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/updatenumber`, {
      mobileNumber,
      otp,
      hostName,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};

export const passwordChangeApi = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const { data } = await axiosInstance.post(`/storuser/updatepassword`, {
      currentPassword,
      newPassword,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};

export const getSingleProductDetailsApi = async (id?: string) => {
  try {
    const { data } = await axiosInstance2.get(
      `/userstore/auth/singleProducts/${id}`
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
      data: error,
    };
  }
};
export const PostcouponApi = async (code?: string, productDetails?: any) => {
  try {
    const { data } = await axiosInstance.post(`/storcoupon/apply`, {
      code,
      productDetails,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong plese try after sometime",
      data: error,
    };
  }
};

export const getShiprocketToken = async () => {
  try {
    const { data } = await axiosInstance.get(`/store/shiprocket/token`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong plese try after sometime",
      data: error,
    };
  }
}
export const getDealerInvoicesApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/store/dealer-invoices`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong plese try after sometime",
      data: error,
    };
  }
};
export const createRazorpayApi = async (amount: number) => {
  try {
    const response = await axiosInstance.post(`/store/create-order`, { amount });
    console.log('response',response)
    return response.data;
  } catch (error) {
    throw new Error("Failed to create Razorpay order");
  }
};
export const dealerPaymentApi = async (response: any, invoiceId: string, amount: number) => {
  try {
    await axiosInstance.post(`/store/dealer-invoices`, { response, invoiceId, amount });
  } catch (error) {
    throw new Error("Failed to verify Razorpay payment");
  }
};







export const getInvoicesApi = async () => {
  try {
    const { data } = await axiosInstance.get(`/store/invoice`);
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
    };
  }
};
export const postInvoicesApi = async (response: any, invoiceId: string, amount: number) => {
  try {
    const { data } = await axiosInstance.post(`/store/invoice`, { response, invoiceId, amount });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
    };
  }
};

export const postDownlodReceiptApi = async (id: string) => {
  try {
    const { data } = await axiosInstance.post(`/store/downloadreceipt`, { id });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
    };
  }
};

export const postStockRequestApi = async (productName:string,
  stockQuantity:any,expectedDate:string,
  advancePayment:boolean,productId:string,adminId:string) => {
  try {
    const { data } = await axiosInstance.post(`/store/stockrequest`, {productName,
      stockQuantity,expectedDate,advancePayment,productId ,adminId });
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Unable to process your request. Please try again.",
    };
  }
};



export const getStockRequestApi = async (pageNo: string,type:string) => {
  try {
    const { data } = await axiosInstance.get(`/store/stockrequest`,{params:{pageNo,type}});
    return data;
  } catch (error) {
    return {
      error: true,
      message: "api call faild",
    };
  }
};


// shprocket api calls
export const getDeliveryCharge = async (productData: any, token: string) => {
  try {
    console.log("tocken",token)
    console.log("productData",productData)
    const { data } = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: productData,
      }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong plese try after sometime",
      data: error,
    };
  }
};

