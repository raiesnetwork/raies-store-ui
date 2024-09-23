import { create } from "zustand";
import { MystoreStore, onlinePayment } from "./Interfaces";
import {
  AddToCartApi,
  createAddressApi,
  createBarterOrderApi,
  createBiddingOrderApi,
  createOrderApi,
  createRazorpayOrderApi,
  createStoreUserApi,
  DeleteAddressApi,
  DeleteCartApi,
  FetchToCartApi,
  getAddressApi,
  getAllProductApi,
  getUserOrderApi,
  latestProductApi,
  loginUserApi,
  loginWithPasswordApi,
  registrationVerify,
  updateCartApi,
  verifyNumberApi,
  verifyRazorpayPaymentApi,
} from "./StoreApi";

const useMystoreStore = create<MystoreStore>((set) => ({
  onlinePaymenterror: "",
  AllProducts: [],
  getAllProduct: async (hostName) => {
    if (hostName) {
      const resp = await getAllProductApi(hostName);
      set(() => ({ AllProducts: resp?.data }));
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
  cartData: [],
  AddToCart: async (id, quantity, userId) => {
    const data = await AddToCartApi(id, quantity, userId);
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
  verifyNumber: async (number) => {
    const data = await verifyNumberApi(number)
    return data
  },
  registrationVerify: async (number,hostname) => {
    const data = await registrationVerify(number,hostname)
    return data
  },
  createUser: async (datas) => {
    const data = await createStoreUserApi(datas)
    return data
  },

  loginUser: async (number, otp, subdomain) => {
    const data = await loginUserApi(number, otp, subdomain)
    return data
  },
  logedIn: false,
  checkLoggedIn: (data) => {
    set(() => ({ logedIn: data }))
  },
  latestProduct: async (hostName,name) => {
    const data = await latestProductApi(hostName,name)
    set(() => ({ AllProducts: data?.data }));

    return data
  },
  isOpenSignupModal: false,
  signupModal: () => {
    set((s) => ({ isOpenSignupModal: !s.isOpenSignupModal }))
  },
  userName: "",
  setUserName(name) {
    set(() => ({ userName: name }))
  },
  createAddress: async (data) => {
    const resp = await createAddressApi(data)
    return resp
  },
  deleteAddress: async (id) => {
    const resp = await DeleteAddressApi(id)
    return resp
  },
  addressData: [],
  getAddress: async () => {
    const data = await getAddressApi()
    set(() => ({ addressData: data.data }))
    return data
  },
  selectedAddress: {
    fullAddress: "",
    fullName: "",
    id: "",
    landmark: "",
    mobileNumber: "",
    pincode: ""
  },
  setSelectedAddress: (data) => {
    set(() => ({ selectedAddress: data }))
  },
  isOpenselectAddressModal: false,
  setIsOpenSelectAddressModal: () => {
    set((s) => ({ isOpenselectAddressModal: !s.isOpenselectAddressModal }))
  },
  createOrdr: async (data) => {
    const dataa = await createOrderApi(data)
    return dataa
  },
  getUserOrder: async () => {
    const data = await getUserOrderApi()
    return data
  },
  createBarterOrder: async (data) => {
    const datas = await createBarterOrderApi(data)
    return datas
  },
  createBiddingOrder: async (data) => {
    const datas = await createBiddingOrderApi(data)
    return datas
  },
  loginWithPassword: async (number, password, subdomain) => {
    const data = await loginWithPasswordApi(number, password, subdomain)
    return data
  },

  createRazorpayOrder: async (amount: number) => {
    try {
      const order = await createRazorpayOrderApi(amount);
      return order;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ onlinePaymenterror: error.message });
    }
  },

  verifyRazorpayPayment: async (data: onlinePayment) => {
    try {
      await verifyRazorpayPaymentApi(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ onlinePaymenterror: error.message });
    }
  },
  isOpenAddressModal: false,
  OpenAddressModal: () => {
    set((s) => ({ isOpenAddressModal: !s.isOpenAddressModal }))
  },
  addressSupparatorBarter: false
  ,
  addressSupparator: false,
  setAddressSuparator: (data) => {
    set(() => ({ addressSupparator: data }))
  },
  setaddressSupparatorBarter: (data) => {
    set(() => ({ addressSupparatorBarter: data }))
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("kt-auth-react-st");
    set(() => ({
      logedIn: false,
      userName: "",
    }));
  },
}));

export default useMystoreStore;
