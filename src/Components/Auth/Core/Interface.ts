export interface Auth{
    AuthApiCall:()=>Promise<AuthResp>
}
export interface AuthResp{
    error:boolean
    message:string
    data:boolean
    
}