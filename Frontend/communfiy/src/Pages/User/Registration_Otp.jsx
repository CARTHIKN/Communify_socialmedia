import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useState,useEffect } from "react";

function Registration_Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState([]);
  const baseUrl = "http://127.0.0.1:8000";
  const email = location.state?.email;
  const isForChangePassword = location.state?.isForChangePassword;
 
  useEffect(() => {
    // Check if email and isForChangePassword are present
    if (!email || isForChangePassword === undefined) {
      // Redirect to the registration page or another page of your choice
      navigate("/test", { replace: true });
    }
 }, [navigate, email, isForChangePassword]);



  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);
    const formData = {
      email : email,
      otp: event.target.otp.value,
    };

    try {
      const res = await axios.post(baseUrl + "/api/accounts/register/otp", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        if (isForChangePassword) {
          navigate("/change-password",{state : {email:email},replace: true,});
        } else {
          navigate("/",{
            state: res.data.message,
            replace: true,
          }); 
        }
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

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center bg-red px-6 py-12 lg:px-8  ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            // alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Enter your one time password
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
                OTP
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {/* {formError.length > 0 && (
                <div className="text-fuchsia-500">
                  {formError.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error.message}
                    </p>
                  ))}
                </div>
              )} */}
              {Object.keys(formError).length >= 0 && (
                <div className="text-red-500">
                  {Object.entries(formError).map(([field, message], index) => (
                    <p key={index} className="text-red-500">
                      {message} {/* Use message directly */}
                    </p>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Verify
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              {/* <Link to="register">create a new account</Link> */}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration_Otp;
