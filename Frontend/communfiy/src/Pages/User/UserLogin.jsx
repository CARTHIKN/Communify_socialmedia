import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { set_Authentication } from "../../Redux/authentication/authenticationSlice";
import { jwtDecode } from "jwt-decode";
import LoginNavbar from "./LoginNavbar";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";

const UserLogin = () => {
  const [formError, setFormError] = useState([]);
  const [gmail, setGmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.authentication_user.isAuthenticated);
  const isAdmin = useSelector((state) => state.authentication_user.isAdmin);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const credential = jwtDecode(credentialResponse.credential);
      const email = credential.email;
      const username = email.split("@")[0];

      setGmail(email);
      setUsername(username);

      // Call handleLoginOrRegister after state update
      handleLoginOrRegister(email, username);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  const handleLoginOrRegister = async (email, username) => {
    try {
      const res = await axios.post(`${baseUrl}/api/accounts/google/login/`, {
        email,
        username,
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
      }
    } catch (error) {
      console.error("Error:", error.response?.data); // Log any errors
    }
  };

  useEffect(() => {
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
      const res = await axios.post(`${baseUrl}/api/accounts/login/`, formData, {
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
        setFormError(error.response?.data || "An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <LoginNavbar />
      <div className="flex min-h-full lg:pb-48 flex-1 bg-zinc-200 flex-col justify-center px-6 py-12 lg:px-8" style={{ height: "100vh" }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Enter Your Username or Email address
              </label>
              <div className="mt-2">
                <input
                  id="username_or_email"
                  name="username_or_email"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {Object.keys(formError).length > 0 && (
              <div className="text-red-500">
                {Object.entries(formError).map(([field, message], index) => (
                  <p key={index} className="text-red-500">
                    {message}
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
              onSuccess={(credentialResponse) => {
                const credential = jwtDecode(credentialResponse.credential);
                const email = credential.email;
                const username = email.split("@")[0];

                setGmail(email);
                setUsername(username);

                // Call handleLoginOrRegister after state update
                handleLoginOrRegister(email, username);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              render={(renderProps) => (
                <button
                  className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
                    <title>Google-color</title>
                    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="Color-" transform="translate(-401.000000, -860.000000)">
                        <g id="Google" transform="translate(401.000000, 860.000000)">
                          <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.02690909,16.5109333 0,20.1053333 0,24 C0,27.8946667 1.02690909,31.4890667 2.62345455,34.3957333 L10.5322727,28.3562667 C10.0804318,26.9856 9.82727273,25.5242667 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
                          <path d="M24,9.82727273 C26.6352,9.82727273 29.0309091,10.7317333 30.8756364,12.2152 L38.1050909,5.57345455 C34.1792727,2.1632 29.3312,0 24,0 C14.8181818,0 6.82363636,5.34836364 2.62363636,13.6043636 L10.5324545,19.6438 C12.2870909,14.7173091 17.6167273,9.82727273 24,9.82727273" id="Fill-2" fill="#EB4335"></path>
                          <path d="M24,38.1727273 C17.6167273,38.1727273 12.2870909,33.2826909 10.5324545,28.3562 L2.62363636,34.3956364 C6.82363636,42.6516364 14.8181818,48 24,48 C29.1130909,48 34.1792727,45.9128 38.1050909,42.4265455 L30.8756364,35.7848 C29.0309091,37.2682667 26.6352,38.1727273 24,38.1727273" id="Fill-3" fill="#34A853"></path>
                          <path d="M46.1454545,24.5367273 C46.1454545,23.3024 46,22.1374545 45.7636364,21.0101818 L24,21.0101818 L24,27.4363636 L36.1454545,27.4363636 C35.5184,30.3185455 33.7792,32.7426909 31.312,34.2152727 L38.1050909,40.4265455 C42.2196364,36.6865455 45,30.936 45,24.5367273" id="Fill-4" fill="#4285F4"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                  Sign in with Google
                </button>
              )}
            />
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member? <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up for free</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
