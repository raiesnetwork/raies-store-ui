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
  getInvoicesApi,
  getProfileInfoApi,
  getShiprocketToken,
  getSingleProductDetailsApi,
  getStoreIconApi,
  // getAllProductApi,
  getUserOrderApi,
  latestProductApi,
  loginUserApi,
  loginWithPasswordApi,
  PostcouponApi,
  postDownlodReceiptApi,
  postInvoicesApi,
  registrationVerify,
  updateCartApi,
  updateProfileInfoApi,
  verifyMailApi,
  verifyNumberApi,
  verifyRazorpayPaymentApi,
} from "./StoreApi";

const useMystoreStore = create<MystoreStore>((set) => ({
  storeIconRefresh: false,
  onlinePaymenterror: "",
  storeData: {
    storeName: "",
    storeIcon: "",
    storeBanner: "",
    refundAndCancelPolicy:""
  },
  AllProducts: [],
  // getAllProduct: async (hostName) => {
  //   if (hostName) {
  //     const resp = await getAllProductApi(hostName);
  //     set(() => ({ AllProducts: resp?.data }));
  //     return resp;
  //   }
  // },
  singleProductData: {
    brandName: "",
    description: "",
    flag: false,
    _id: "",
    mainImage: "",
    price: 0,
    productCount: 0,
    productName: "",
    subImages: [],
    user: "",
    currency: "",
    priceOption: "",
    endDate: "",
    minBidPrice: 0,
    maxBidPrice: 0,
    minBidPriceCurrency: "",
    maxBidPriceCurrency: "",
    barterProductName: "",
    packageBreadth:"",
    packageHeight:"",
    packageLength:"",
    packageWidth:"",
    pickupAddress:{},
    productWeight:"",
    productWeightType:""
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
    const data = await verifyNumberApi(number);
    return data;
  },
  registrationVerify: async (number, hostname) => {
    const data = await registrationVerify(number, hostname);
    return data;
  },
  createUser: async (datas) => {
    const data = await createStoreUserApi(datas);
    return data;
  },

  loginUser: async (number, otp, subdomain) => {
    const data = await loginUserApi(number, otp, subdomain);
    return data;
  },
  logedIn: false,
  checkLoggedIn: (data) => {
    set(() => ({ logedIn: data }));
  },
  latestProduct: async (hostName, name) => {
    const data = await latestProductApi(hostName, name);
    set(() => ({ AllProducts: data?.data }));

    return data;
  },
  isOpenSignupModal: false,
  signupModal: () => {
    set((s) => ({ isOpenSignupModal: !s.isOpenSignupModal }));
  },
  userName: "",
  setUserName(name) {
    set(() => ({ userName: name }));
  },
  createAddress: async (data) => {
    const resp = await createAddressApi(data);
    return resp;
  },
  deleteAddress: async (id) => {
    const resp = await DeleteAddressApi(id);
    return resp;
  },
  addressData: [],
  getAddress: async () => {
    const data = await getAddressApi();
    set(() => ({ addressData: data.data }));
    return data;
  },
  selectedAddress: {
    fullAddress: "",
    fullName: "",
    _id: "",
    landmark: "",
    mobileNumber: "",
    pincode: "",
  },
  setSelectedAddress: (data) => {
    set(() => ({ selectedAddress: data }));
  },
  isOpenselectAddressModal: false,
  setIsOpenSelectAddressModal: () => {
    set((s) => ({ isOpenselectAddressModal: !s.isOpenselectAddressModal }));
  },
  createOrdr: async (data) => {
    const dataa = await createOrderApi(data);
    return dataa;
  },
  getUserOrder: async (subdomain) => {
    const data = await getUserOrderApi(subdomain);
    return data;
  },
  createBarterOrder: async (data) => {
    const datas = await createBarterOrderApi(data);
    return datas;
  },
  createBiddingOrder: async (data) => {
    const datas = await createBiddingOrderApi(data);
    return datas;
  },
  loginWithPassword: async (number, password, subdomain) => {
    const data = await loginWithPasswordApi(number, password, subdomain);
    return data;
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
    set((s) => ({ isOpenAddressModal: !s.isOpenAddressModal }));
  },
  addressSupparatorBarter: false,
  addressSupparator: false,
  setAddressSuparator: (data) => {
    set(() => ({ addressSupparator: data }));
  },
  setaddressSupparatorBarter: (data) => {
    set(() => ({ addressSupparatorBarter: data }));
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("kt-auth-react-st");
    set(() => ({
      logedIn: false,
      userName: "",
    }));
  },
  getStoreIconAndName: async (hostName) => {
    const response = await getStoreIconApi(hostName);
    set((state) => ({ storeData: response.data, storeIconRefresh: !state.storeIconRefresh }))

    return response.data
  },

  setStoreIconRefresh: () => {
    set((s) => ({ storeIconRefresh: !s.storeIconRefresh }));

  },
  profileData:{
 email:"",
 fullName:"",
 gender:"",
 mobileNumber:"",
 profileImage:"",
 role:"",
 storeName:"",storeBanner:"",
 storeIcon:"",
 wareHouseAddress:"",
 wareHouseContactNumber:"",
 wareHouseOwnerName:"",
 subscriptionId:"",
 plan:""
  },
  getProfileInfo:async()=>{
    const data=await getProfileInfoApi()
    set(() => ({ profileData: data?.data }));

    return data
  },
  updateProfileInfo:async(data)=> {
    const response=await updateProfileInfoApi(data)
    return response
  },
  modalOpener:"",
  isOTPmodalVisible:false,
  setIsOtpModalVisible:(data)=>{
    set((s) => ({ isOTPmodalVisible: !s.isOTPmodalVisible,modalOpener:data }));

  },
  verifyEmail:async(mail)=>{
    await verifyMailApi(mail)
  },
  getSingleProduct:async(id)=>{
    const data=await getSingleProductDetailsApi(id)
    console.log(data);
    
    set(()=>({singleProductData:data?.data

    }))
  },
  postCouponApi:async(code,details)=>{
    const data=await PostcouponApi(code,details)
    return data
  },
  shiprocketToken:"",
  getShprocketToken:async()=>{
    const {data}=await getShiprocketToken()
  set(()=>({shiprocketToken:data?.token}))
  console.log(data?.token);
  
  },



  storeInvoices: [
    {
      amount: "",
      createdAt: "",
      dueDate: "",
      _id: "",
      invoiceNumber: "",
      status: "",
  
      subscription: {
        cardholderName: "",
        city: "",
        region: "",
        state: "",
        storeName: "",
        UserDetails:{
          mobile:"",
          profile:{
            name:""
          }
        }
      },
      
    }
  ],
  getInvoice:async()=>{
  const data=await getInvoicesApi()
  set(()=>({storeInvoices:data?.data}))
  },
  storeInvoiceData:{
    amount: "",
    createdAt: "",
    dueDate: "",
    _id: "",
    invoiceNumber: "",
    status: "",
  
    subscription: {
      cardholderName: "",
      city: "",
      region: "",
      state: "",
      storeName: "",
      UserDetails:{
        mobile:"",
        profile:{
          name:""
        }
      }
    },
   
  },
  setInvoiceData:(data)=> {
    set(()=>({storeInvoiceData:data}))
  
  },
  postInvoicePayment:async(response, invoiceId, amount)=> {
  const data =await postInvoicesApi(response, invoiceId, amount)
  return data
  },
  postDownloadReceipt:async(id)=>{
    const data=await postDownlodReceiptApi(id)
    return data
  },
  isOpenPlanModal:false,
  setOpenPlanModal:()=>{
    set((s)=>({isOpenPlanModal:!s.isOpenPlanModal}))
  },storeIconsLoader:true,
  setStoreIconLoader:(data)=>{
    set(()=>({storeIconsLoader:data}))
  }
}));

export default useMystoreStore;
