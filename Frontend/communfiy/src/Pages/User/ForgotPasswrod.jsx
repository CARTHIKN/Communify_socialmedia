import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPasswrod() {

  const [formError, setFormError] = useState([]);
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000";


  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);    
    const formData = {
      email: event.target.email.value,
    };

    try {
      const res = await axios.post(baseUrl + "/api/accounts/forgotpassword/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        navigate("/otp", {
          state: { email: event.target.email.value, isForChangePassword:true },
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
            Forgot Password
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
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            
            

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send OTP
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember Password ?{" "}
            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              <Link to="/">Back to login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswrod
