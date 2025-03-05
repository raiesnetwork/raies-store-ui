import React, { createContext, ReactNode, useContext, useEffect, useLayoutEffect, useState } from "react";
import useMystoreStore from "../Store/Core/Store";
import { getSubdomain } from "../../Utils/Subdomain";
import axios from 'axios'
interface AuthContextType {
  user: any; 
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
const { hostname } = window.location;
let hostName = getSubdomain(hostname);
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvaider: React.FC<{ children: ReactNode }> = ({

  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
  const { getStoreIconAndName,setStoreIconLoader } = useMystoreStore((s) => s);
  useLayoutEffect(() => {
    const storedUser = localStorage.getItem("users");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
         
        // Optional: Check if the token is expired
        if (parsedUser?.api_token) {
          setUser(parsedUser);
          setisAuthenticated(true)
        } else {
          localStorage.removeItem("users"); 
          setisAuthenticated(false)

        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);
  useEffect(() => {
    const apihelper = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/userstore/auth/createtoken/${hostName}`
        );
        localStorage.setItem(`store_t`, JSON.stringify(data?.token));
  
        await getStoreIconAndName(hostName);
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setStoreIconLoader(false);
      }
    };
  
    apihelper();
  }, [hostName]); 
  
 
  const login =(userData: any) => {
    localStorage.setItem("users", JSON.stringify(userData));
    setUser(userData);
    setisAuthenticated(true)

  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("users");
    setisAuthenticated(false)

  };
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
