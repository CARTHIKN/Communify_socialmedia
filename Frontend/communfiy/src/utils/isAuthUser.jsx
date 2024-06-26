
import { jwtDecode } from "jwt-decode";
import axios from 'axios'





const updateUserToken = async ()=>{
  
    const refreshToken = localStorage.getItem("refresh");
    const baseURL='https://communify.sneaker-street.online'
    try {
        const res = await axios.post(baseURL+'/api/accounts/token/refresh/', 
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