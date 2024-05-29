import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useState,useEffect } from "react";

function ChangePassword() {
    const [formError, setFormError] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const baseUrl = "http://127.0.0.1:8000";
    const email = location.state?.email;
    useEffect(() => {
        // Check if email and isForChangePassword are present
        if (email === undefined) {
          // Redirect to the registration page or another page of your choice
          navigate("/test", { replace: true });        }
     }, [email]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError([]);
        const password = event.target.password.value;
        const confirm_password = event.target.confirm_password.value;
     
        

        if (password !== confirm_password) {
        setFormError([
            { field: "password_confirmation", message: "Passwords do not match !" },
        ]);
        return; 
        }
        if (password.length < 8) {
            setFormError([
              { field: "password", message: "Password length should be at least 8 characters." },
            ]);
            return;
          }
        
        const formData = {
          email : email,
          password : event.target.password.value,
          
        };
    
        try {
          const res = await axios.post(baseUrl + "/api/accounts/change-password/", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (res.status === 200) {
            navigate("/", {
              state: res.data.message,
              replace: true,
            });
            // window.history.replaceState(null, null, "/test");
            // return res;
          }
        } catch (error) {
          if (error.response && error.response.status === 406) {
            setFormError(error.response.data.message);
          } else {
            setFormError(error.response);
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
            Change your password
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                {/* <Link to="forgot-password"> Forgot password?</Link> */}
                   
                  
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



            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="text-sm">
                {/* <Link to="forgot-password"> Forgot password?</Link> */}
                   
                  
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            
            {formError.length > 0 && (
            <div className="text-red-500">
              {formError.map((error, index) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
          )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change
              </button>
            </div>
          </form>

          
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
