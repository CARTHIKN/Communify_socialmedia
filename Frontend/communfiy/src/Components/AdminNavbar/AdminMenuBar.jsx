import React, { useState,useEffect  } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import { useNavigate,Link } from "react-router-dom";
import userimg from "../../images/user.png"
import axios from "axios";


export default function AdminMenuBar({ setToggle, toggle }) {
  // const authentication_user = useSelector((state) => state.authentication_user);
  const username = useSelector((state) => state.authentication_user.username);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const baseUrl = "http://127.0.0.1:8000";

   const handleToggle = ()=>{
    setToggle(!toggle)
   }

   const logout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        usernamename: null,
        isAuthenticated: false,
        isAdmin: false,
      })
      
    );

    navigate("/admin");
  };
  

   const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
    console.log("haiiiii")
    console.log(username);
  };
 
  return (
    
    <div className="">
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={handleToggle}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <a href="/" className="flex ms-2 md:me-24">
              
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Communify
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <div >
                <button
                  type="button"
                  className="flex text-sm bg-zinc-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={dropdownOpen}
                  onClick={handleDropdownToggle}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userData? userData.profile_picture? userData.profile_picture: userimg :userimg}
                    alt="user photo"
                  />
                </button>
              </div>
              {dropdownOpen && (
                <div className="z-50 absolute right-0  mt-48 w-40 ml-10  text-base list-none bg-white divide-y divide-zinc-500 rounded shadow dark:bg-zinc-800 dark:divide-Zinc-800" id="dropdown-user">
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      {username}
                    </p>
                    
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                        <Link to="/user-profile">Profile</Link>
                      </a>
                    </li>
                    <li>
                      <a onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
  )
}