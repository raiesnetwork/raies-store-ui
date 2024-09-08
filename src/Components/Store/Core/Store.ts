import { create } from "zustand";
import { MystoreStore } from "./Interfaces";
import {
  AddToCartApi,
  DeleteCartApi,
  FetchToCartApi,
  getAllProductApi,
  updateCartApi,
} from "./StoreApi";

const useMystoreStore = create<MystoreStore>((set) => ({
  AllProducts: [],
  getAllProduct: async (id) => {
    if (id) {
      const resp = await getAllProductApi(id);
      set(() => ({ AllProducts: resp?.data?.data }));
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
    communityId: "",
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
  AddToCart: async (id, quantity) => {
    const data = await AddToCartApi(id, quantity);
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
}));

export default useMystoreStore;
