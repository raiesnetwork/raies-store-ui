export interface ProductViewCardProps {
  data: respProduct;
}

export interface respProduct {
  productName: string;
  brandName: string;
  price: number;
  mainImage: string;
  subImages: string[];
  productCount: number;
  user: string;
  flag: boolean;
  description: string;
  _id: string;
  currency: string;
  priceOption: string;
  endDate: string;
  minBidPrice: number;
  maxBidPrice: number;
  minBidPriceCurrency: string;
  maxBidPriceCurrency: string;
  barterProductName: string;
}
export interface barterOrder{
  addressId:string
    productImage: string
    productId:string
}export interface biddingOrder{
  addressId:string
    biddingAmount: string
    productId:string
}
export interface storeData{
  storeName:string
    storeIcon: string
    storeBanner:string
    refundAndCancelPolicy:string
}
export interface MystoreStore {
  // getAllProduct: (id?: string|null) => Promise<ApiResponce>;
  AllProducts: respProduct[];
  storeData:storeData;
  singleProductData: respProduct;
  updateSingleProductData: (data: respProduct) => void;
  onlinePaymenterror:string;
  AddToCart: (
    id: string,
    count: number,
    userId: string
  ) => Promise<ApiResponce>;
  cartData: respStoreCart[];
  FetchToCart: () => void;
  cartLoader: boolean;
  setCartLoader: (d: boolean) => void;
  deleteCart: (id: string) => Promise<ApiResponce>;
  verifyNumber: (number: string) => Promise<ApiResponce>;
  createUser: (data: userStoreCreate) => Promise<ApiResponce>;
  loginUser: (data: string, otp: string,subdomain:string) => Promise<ApiResponce>;
  loginWithPassword: (data: string, pass: string,subdomain:string|null) => Promise<ApiResponce>;
  updateCart: (id: string, quantity: number) => Promise<ApiResponce>;
  latestProduct: (hostName: string|null,name:string) => Promise<ApiResponce>;
  createAddress: (data: StoreAddress) => Promise<ApiResponce>;
  getProfileInfo: () => Promise<ApiResponce>;
  updateProfileInfo: (data:updateProfileInfo) => Promise<ApiResponce>;
  deleteAddress: (hostName: string) => Promise<ApiResponce>;
  createOrdr: (hostName: createOrder) => Promise<ApiResponce>;
  createBarterOrder: (hostName: barterOrder) => Promise<ApiResponce>;
  createBiddingOrder: (hostName: biddingOrder) => Promise<ApiResponce>;
  getStoreIconAndName: (hostName: string|null) => Promise<ApiResponce>;
  getUserOrder: (subDomain:string|null) => Promise<ApiResponce>;
  getAddress: () => Promise<ApiResponce>;
  setHomeLoader: (data: boolean) => void;
  homeLoader: boolean;
  isOpenBarteModal: boolean;
  setOpenBarterModal: () => void;
  setOpenBiddingModal: () => void;
  isOpenBiddingModal: boolean;
  logedIn: boolean;
  checkLoggedIn: (data: boolean) => void;
  signupModal: () => void;
  isOpenSignupModal: boolean;
  userName: string | null;
  setUserName: (name: string | null) => void;
  addressData:respStoreAddress[]
  selectedAddress:respStoreAddress,
  setSelectedAddress:(data:respStoreAddress)=>void
  isOpenselectAddressModal:boolean
  setIsOpenSelectAddressModal:()=>void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRazorpayOrder: (amount: number) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyRazorpayPayment: (data:onlinePayment) => Promise<any>;
  isOpenAddressModal:boolean,
OpenAddressModal:()=>void
addressSupparator:boolean,
addressSupparatorBarter:boolean,
setAddressSuparator:(s:boolean)=>void
setaddressSupparatorBarter:(s:boolean)=>void
logout:()=>void;
registrationVerify:(number:string,hostname:string|null)=>Promise<any>;
storeIconRefresh:boolean
  setStoreIconRefresh:()=>void
  profileData:updateProfileInfo
  isOTPmodalVisible:boolean,
  setIsOtpModalVisible:(data:string)=>void
  modalOpener:string
  verifyEmail:(mail:string)=>void
  getSingleProduct:(id?:string)=>void
}
export interface createOrder{
  productDetails:[]          
    totalAmount:string  
    paymentMethod :string
    addressId  :string
    
}
export interface updateProfileInfo{
  fullName:string
  profileImage?:string
  gender?:string
  email:string
  mobileNumber:string
  role?:string
  storeName:string
  wareHouseAddress?:string
  wareHouseContactNumber?:string
  wareHouseOwnerName?:string
  storeIcon?:string
  storeBanner?:string
  subscriptionId?:string
    
}
export interface onlinePayment{
  productDetails:[]          
    totalAmount:string  
    paymentMethod :string
    addressId  :string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response:any
    
}
export interface ApiResponce {
  [x: string]: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: string | any;
  error: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
export interface myStoreCart {
  productName: string;
  barterProductName: string;
  currency: string;
  mainImage: string;
  endDate: string;
  _id: string;
  maxBidPrice: string;
  minBidPrice: string;
  productCount: number;
  maxBidPriceCurrency: string;
  minBidPriceCurrency: string;
  price: string;
}
export interface respStoreCart {
  _id: string;
  quantity: number;
  productDetails: myStoreCart;
}
export interface userStoreCreate {
  fullName: string;
  mobileNumber: string;
  otp: string;
  hostname: string|null;
  password:string
}
export interface respStoreAddress {
  _id: string;
  fullName: string;
  mobileNumber: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
}export interface StoreAddress {
  fullName: string;
  mobileNumber: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
}
