import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginNavbar from "./LoginNavbar";

function UserRegister() {
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError({}); // Initialize formError as an object

    const password = event.target.password.value;
    const passwordConfirmation = event.target.password_confirmation.value;

    if (password !== passwordConfirmation) {
      setFormError({
        password_confirmation: ["Passwords do not match!"],
      });
      return;
    }

    const formData = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phone: event.target.phone.value,
    };

    try {
      const res = await axios.post(baseUrl + "/api/accounts/register/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        navigate("/otp", {
          state: { email: event.target.email.value, isForChangePassword: false },
        });
        return res;
      }
    } catch (error) {
      if (error.response && error.response.status === 406) {
        setFormError({ general: error.response.data.message });
      } else if (error.response && error.response.data.errors) {
        setFormError(error.response.data.errors); // Update formError as an object
      } else {
        setFormError({ general: "An error occurred. Please try again later." });
      }
    }
  };

  return (
    <div>
      <LoginNavbar/>
    <div className="mx-auto ">
      
      <div className="flex min-h-full flex-1 flex-col justify-center bg-red px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center  mt-24 text-xl font-bold leading-9 tracking-tight text-zinc-600 ">
            Create your account
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
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="username"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="phone"
                  type="number"
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

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Re-enter Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {Object.keys(formError).length > 0 && (
            <div className="text-fuchsia-500">
              {Object.entries(formError).map(([field, messages], index) => (
                <div key={index} className="text-red-500">
                  {Array.isArray(messages) ? (
                    messages.map((message, subIndex) => (
                      <p key={subIndex}>{message}</p>
                    ))
                  ) : (
                    <p>{messages}</p>
                  )}
                </div>
              ))}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-zinc-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-500">
            <span>Already have an account?</span>
            <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default UserRegister;
