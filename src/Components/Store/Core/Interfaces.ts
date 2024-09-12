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
  userId?: string;
  flag: boolean;
  description: string;
  id: string;
  currency: string;
  priceOption: string;
  endDate: string;
  minBidPrice: number;
  maxBidPrice: number;
  minBidPriceCurrency: string;
  maxBidPriceCurrency: string;
  barterProductName: string;
}

export interface MystoreStore {
  getAllProduct: (id?: string) => void;
  AllProducts: respProduct[];
  singleProductData: respProduct;
  updateSingleProductData: (data: respProduct) => void;
  AddToCart: (id: string, count: number) => Promise<ApiResponce>;
  cartData: respStoreCart[];
  FetchToCart: () => void;
  cartLoader: boolean;
  setCartLoader: (d: boolean) => void;
  deleteCart: (id: string) => Promise<ApiResponce>;
  verifyNumber: (number: string) => Promise<ApiResponce>;
  createUser: (data: userStoreCreate) => Promise<ApiResponce>;
  loginUser: (data: string,otp:string) => Promise<ApiResponce>;
  updateCart: (id: string, quantity: number) => Promise<ApiResponce>;
  latestProduct: (hostName: string) => Promise<ApiResponce>;
  setHomeLoader: (data: boolean) => void;
  homeLoader: boolean;
  isOpenBarteModal: boolean;
  setOpenBarterModal: () => void;
  setOpenBiddingModal: () => void;
  isOpenBiddingModal: boolean;
  logedIn:boolean,
checkLoggedIn:(data:boolean)=>void
signupModal:()=>void
isOpenSignupModal:boolean


}
export interface ApiResponce {
  [x: string]: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: string | any;
  error: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data:any
}
export interface myStoreCart {
  productName: string;
  barterProductName: string;
  currency: string;
  mainImage: string;
  endDate: string;
  id: string;
  maxBidPrice: string;
  minBidPrice: string;
  productCount: number;
  maxBidPriceCurrency: string;
  minBidPriceCurrency: string;
  price: string;
}
export interface respStoreCart {
  id: string;
  quantity: number;
  productDetails: myStoreCart;
}
export interface userStoreCreate{
  fullName:string
  mobileNumber:string
  otp:string

}