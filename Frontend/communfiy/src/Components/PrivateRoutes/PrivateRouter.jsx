import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import isAuthUser from "../../utils/isAuthUser";
import { useDispatch } from "react-redux";
import authenticationSlice, {
  set_Authentication,
} from "../../Redux/authentication/authenticationSlice";
import { set_user_basic_details } from "../../Redux/userBasicDetials/userBasicDetailsSlice";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.authentication_user.isAdmin);

  useEffect(() => {
    const fetchData = async () => {
      const authInfo = await isAuthUser();
      setIsAuthenticated(authInfo.isAuthenticated);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    // Handle loading state, you might show a loading spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page with the return URL

    return <Navigate to="/" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/home" />;
  }

  // If authenticated, render the child components
  return children;
}

export default PrivateRoute;
