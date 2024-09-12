import { create } from "zustand";
import { MystoreStore } from "./Interfaces";
import {
  AddToCartApi,
  createStoreUserApi,
  DeleteCartApi,
  FetchToCartApi,
  getAllProductApi,
  latestProductApi,
  loginUserApi,
  updateCartApi,
  verifyNumberApi,
} from "./StoreApi";

const useMystoreStore = create<MystoreStore>((set) => ({
  AllProducts: [],
  getAllProduct: async (hostName) => {
    if (hostName) {
      const resp = await getAllProductApi(hostName);
      set(() => ({ AllProducts: resp?.data}));
      return resp
    }
  },
  singleProductData: {
    brandName: "",
    description: "",
    flag: false,
    id: "",
    mainImage: "",
    price: 0,
    productCount: 0,
    productName: "",
    subImages: [],
    userId: "",
    currency: "",
    priceOption: "",
    endDate: "",
    minBidPrice: 0,
    maxBidPrice: 0,
    minBidPriceCurrency: "",
    maxBidPriceCurrency: "",
    barterProductName: "",
  },
  updateSingleProductData: (data) => {
    set(() => ({ singleProductData: data }));
  },
  cartData: [
    {
      id: "",
      quantity: 0,
      productDetails: {
        barterProductName: "",
        currency: "",
        endDate: "",
        id: "",
        mainImage: "",
        maxBidPrice: "",
        maxBidPriceCurrency: "",
        minBidPrice: "",
        minBidPriceCurrency: "",
        price: "",
        productCount: 0,
        productName: "",
      },
    },
  ],
  AddToCart: async (id, quantity,userId) => {
    const data = await AddToCartApi(id, quantity,userId);
    return data;
  },
  FetchToCart: async () => {
    const data = await FetchToCartApi();
    set(() => ({ cartData: data.data }));
  },
  cartLoader: true,
  setCartLoader: (data) => {
    set(() => ({ cartLoader: data }));
  },
  deleteCart: async (id) => {
    const data = await DeleteCartApi(id);
    return data;
  },
  updateCart: async (id, quantity) => {
    const data = await updateCartApi(id, quantity);
    return data;
  },

  homeLoader: true,
  setHomeLoader: (data) => {
    set(() => ({ homeLoader: data }));
  },
  isOpenBarteModal: false,
  setOpenBarterModal: () => {
    set((s) => ({ isOpenBarteModal: !s.isOpenBarteModal }));
  },
  isOpenBiddingModal: false,
  setOpenBiddingModal: () => {
    set((s) => ({ isOpenBiddingModal: !s.isOpenBiddingModal }));
  },
  verifyNumber:async(number)=>{
    const data=await verifyNumberApi(number)
    return data
  },
  createUser:async(datas)=>{
    const data=await createStoreUserApi(datas)
    return data
  },

  loginUser:async(number,otp)=>{
    const data=await loginUserApi(number,otp)
    return data
  },
logedIn:false,
checkLoggedIn:(data)=>{
set(()=>({logedIn:data}))
},
latestProduct:async(hostName)=>{
  const data=await latestProductApi(hostName)
  set(() => ({ AllProducts: data?.data}));

  return data
},
isOpenSignupModal:false,
signupModal:()=>{
set((s)=>({isOpenSignupModal:!s.isOpenSignupModal}))
}
}));

export default useMystoreStore;
