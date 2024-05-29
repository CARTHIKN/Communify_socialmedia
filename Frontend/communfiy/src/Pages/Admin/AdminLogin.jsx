import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { set_Authentication } from "../../Redux/authentication/authenticationSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

function AdminLogin() {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000";
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.authentication_user.isAuthenticated);
  const isAdmin = useSelector((state) => state.authentication_user.isAdmin);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const formData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    try {
      const res = await axios.post(baseUrl + "/api/accounts/admin/login/", formData, {
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
            isAdmin: true,
          })
        );

        navigate("/admin/home", {
          state: res.data.message,
        });
        return res;
      }
    } catch (error) {
      if (error.response && error.response.status === 406) {
        setFormError(error.response.data.message);
      } else {
        setFormError("Invalid credentials");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/home");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      navigate("/home");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-red px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your admin account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Enter Your Super User Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
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
          {formError && <div className="text-red-500">{formError}</div>}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
