import React, { useEffect } from 'react'
import useAuth from './Core/Store'
import useMystoreStore from '../Store/Core/Store'
const Auth:React.FC<{children:React.ReactNode}> = ({children}) => {
    const {AuthApiCall}=useAuth((s)=>s)
    const {checkLoggedIn}=useMystoreStore((s)=>s)
useEffect(()=>{
const apiHelper=async()=>{
   const Data=await AuthApiCall()
  checkLoggedIn(Data.data)
  console.log('hai',Data);
}
apiHelper()
},[])

  return (
     <>{children}</>
   
  )
}

export default Auth