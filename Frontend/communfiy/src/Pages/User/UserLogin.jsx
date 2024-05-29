import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { set_Authentication } from "../../Redux/authentication/authenticationSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import LoginNavbar from "./LoginNavbar";
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin } from '@react-oauth/google';




const UserLogin = () => {
  const [formError, setFormError] = useState([]);
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000";
  const dispatch = useDispatch();
  const [gmail,setGmail] = useState('')
  const [username, setUsername]=useState('')
  const isAuthenticated = useSelector((state) => state.authentication_user.isAuthenticated);
  const isAdmin = useSelector((state) => state.authentication_user.isAdmin);
  console.log(isAuthenticated)

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  const handleLoginOrRegister = async () => {
    try {
      const res = await axios.post(baseUrl + "/api/accounts/google/login/", {
        email: gmail,
        username: username,
      });
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
     
       
  
        dispatch(
          set_Authentication({
            username: res.data.username,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
          })
        );
  
        navigate("/home", {
          state: res.data.message,
        });
  
         // Print the response data to the console
        // Handle the response data as needed (e.g., store tokens in localStorage, navigate to another page)
      }
    } catch (error) {
      console.error("Error:", error.response.data); // Log any errors
      // Handle errors as needed (e.g., show error messages to the user)
    }
  };

  useEffect(() => {
    // Check if the user is authenticated and a superuser
    if (isAuthenticated && isAdmin) {
      navigate("/admin/home");
    }
  }, [isAuthenticated, isAdmin, navigate]);


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);

    const formData = {
      username_or_email: event.target.username_or_email.value,
      password: event.target.password.value,
    };

    try {
      const res = await axios.post(baseUrl + "/api/accounts/login/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

 
        

        dispatch(
          set_Authentication({
            username: jwtDecode(res.data.access).username,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
          })
        );

  

        navigate("/home", {
          state: res.data.message,
        });
        return res;
      }
    } catch (error) {
      if (error.response && error.response.status === 406) {
   
        setFormError(error.response.data.message);
      } else {

        setFormError(error.response.data);
      }
    }
  };
  useEffect(() => {
    if (isAuthenticated ) {
      navigate("/home");
    }
  }, [isAuthenticated,navigate]);


  
 
  return (
    <>

    <LoginNavbar/>

      <div className="flex min-h-full lg:pb-48 flex-1 bg-zinc-200 flex-col justify-center bg-red px-6 py-12 lg:px-8" style = {{height: "100vh"}} >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            // alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            action="#"  
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter Your Username or Email address
              </label>
              <div className="mt-2">
                <input
                  id="username_or_email"
                  name="username_or_email"
                  type="username_or_email"
                  autoComplete="username_or_email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                <Link to="forgot-password"> Forgot password?</Link>
                   
                  
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {Object.keys(formError).length >= 0 && (
                <div className="text-red-500">
                  {Object.entries(formError).map(([field, message], index) => (
                    <p key={index} className="text-red-500">
                      {message} {/* Use message directly */}
                    </p>
                  ))}
                </div>
              )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
              
            </div>
          </form>

          <div className="flex items-center justify-center mt-5">
          <GoogleLogin
          clientId="59807333790-hna421k9o3uqru08uea8qtolhohrauq6.apps.googleusercontent.com" 
      onSuccess={credentialResponse => {
        const credential = jwtDecode(credentialResponse.credential)
        setGmail(credential.email)
        const parts = credential.email.split('@');
        const username = parts[0];
        setUsername(username);
        handleLoginOrRegister()
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      render={(renderProps) => (
              <button className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                  <span>Continue with Google</span>
              </button>
                 )}
                 />
              </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Not a member?{" "}
            <span className="font-semibold leading-6 text-zinc-600 hover:text-zinc-500">
              <Link to="register">create a new account</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
