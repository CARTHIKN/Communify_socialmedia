import React,{useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import isAuthAdmin from '../../utils/isAuthAdmin';



function AdminPrivateRoute({children}) {
    const [isAuthenticate, setIsAuthenticate] = useState({
        'is_authenticate' : false,
        'is_admin' : false
    })
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchData = async () => {
            const authInfo = await isAuthAdmin();
            setIsAuthenticate({
                'is_authenticated' :authInfo.isAuthenticated,
                'is_admin': authInfo.isAdmin,
            });
            setLoading(false);
        };
        fetchData();
    },[])

    if (isLoading){
        return <div>Loading ...</div>
    }

    if (!isAuthenticate.is_authenticated){
        return <Navigate to="/admin/"/>;
    }

    if ((!isAuthenticate.is_admin)){
        return <Navigate to="/admin"/>;
    }

    if ((isAuthenticate && !isAuthenticate.is_admin)){
        return <Navigate to="/home"/>;

    }

  return children
}

export default AdminPrivateRoute
