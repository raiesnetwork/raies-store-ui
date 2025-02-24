import { createAxiosInstance, createAxiosInstanceForProduct } from "../../../Utils/Axios";

const axiosInstance = createAxiosInstance();
const axiosInstanceProduct = createAxiosInstanceForProduct();

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

export const createRazorpayBusinessSubscribe = async (amount:number,subdomain:any) => {
  console.log(amount,subdomain)
  try {
    const {data} = await axiosInstanceProduct.post(`/storebusiness/create-order`,{amount,subdomain});
    console.log(data)

    return data;
  } catch (error) {    
    return {
        error: true,
        message: error,
        data:false
  
      };
  }
};export const verifyRazorpayBusinessSubscribe = async (
  response:any,
              amount:number,
              email:string,
              planDuration:string,
              address1:string,
              address2:string,
              city:string,
              pin:string,
              state:string,
              plan:any,
              region:string,
              mobileNumber:string,
              username:string,
              userType:string,
              paymentType:string,
              password:string,
              subdomain:any,
              userId?:string
) => {
  try {
    const {data} = await axiosInstanceProduct.post(`/storebusiness/verify-payment`,{
      response,
      amount,
      email,
      planDuration,
      address1,
      address2,
      city,
      pin,
      state,
      plan,
      region,
      mobileNumber,
      username,
      userType,
      paymentType,
      password,
      subdomain,
      userId
    });
    return data;
  } catch (error) {    
    return {
        error: true,
        message: error,
        data:false
  
      };
  }
};