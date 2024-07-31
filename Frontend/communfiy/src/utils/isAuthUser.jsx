
import { jwtDecode } from "jwt-decode";
import axios from 'axios'





const updateUserToken = async ()=>{
  
    const refreshToken = localStorage.getItem("refresh");
    const baseUrl = import.meta.env.VITE_BASE_URL
    const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
    const baseUrl1 = import.meta.env.VITE_BASE_URL_1
    const baseUrl2 = import.meta.env.VITE_BASE_URL_2
    try {
        const res = await axios.post(baseUrl+'/api/accounts/token/refresh/', 
        {
            'refresh':refreshToken
        })
        if(res.status === 200){
          localStorage.setItem('access', res.data.access)
          let decoded = jwtDecode(res.data.access);
          return {'username':decoded.username,isAuthenticated:true}
        }
        else
        {
            return {'username':null,isAuthenticated:false}
        }  
        
      }
      catch (error) {
         return {'username':null,isAuthenticated:false}
      }
}



const  isAuthUser = async () => {
    const accessToken = localStorage.getItem("access");

    if(!accessToken)
    {   
        return {'username':null,isAuthenticated:false}
    }
    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);
    if (decoded.exp < currentTime) {
        
        return {'username':decoded.username,isAuthenticated:true}
      } else {
        const updateSuccess = await updateUserToken();
        return updateSuccess;
      }



}
export default isAuthUser ;