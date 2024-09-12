import { create } from "zustand";
import { Auth } from "./Interface";
import { AuthCheckApi } from "./Api";

const useAuth = create<Auth>(() => ({

    AuthApiCall:async()=>{
        const data=await AuthCheckApi()
        return data
    }
}))


export default useAuth