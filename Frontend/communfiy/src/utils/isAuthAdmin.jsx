import { jwtDecode } from "jwt-decode";
import axios from "axios";



const updateAdminToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    const baseUrl = import.meta.env.VITE_BASE_URL
    const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
    const baseUrl1 = import.meta.env.VITE_BASE_URL_1
    const baseUrl2 = import.meta.env.VITE_BASE_URL_2
    try {
        const res = await axios.post(baseUrl+ "/api/accounts/token/refresh/", {
            refresh: refreshToken,
        });
     

        if (res.status === 200) {
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            return res
        } else {
            return res
        }
    
    } catch (error) {
        return false
    }
};

const fetchisAdmin = async () => {
    const token = localStorage.getItem("access");
    const baseUrl = "https://communify.sneaker-street.online";
    const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
    const baseUrl1 = import.meta.env.VITE_BASE_URL_1
    const baseUrl2 = import.meta.env.VITE_BASE_URL_2
    try {
        const res = await axios.get(baseUrl + "/api/accounts/user/details/", {
            headers: {
                Authorization: `Bearer ${token}`, // Note the space after Bearer
                Accept: "application/json",
                "Content-Type": "application/json", // Corrected typo in "application/json"
            },
        });
 
        return res.data.isAdmin; // Assuming your response has an "isAdmin" field
    } catch (error) {
        return false;
    }
};

const isAuthAdmin = async () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        return {name:null,
         isAuthenticated: false, isAdmin:false}
    }

    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);

    if (decoded.exp > currentTime) {
        let checkAdmin = await fetchisAdmin();
   

        return{
            username :decoded.username,
            isAuthenticated :true,
            isAdmin : checkAdmin,
        };

    } else {
        const updateSuccess = await 
        updateAdminToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let checkAdmin = await
            fetchisAdmin();
            return {
                name : null,
                isAuthenticated :false,
                isAdmin: false

            }
        }
    }
}

export default isAuthAdmin;