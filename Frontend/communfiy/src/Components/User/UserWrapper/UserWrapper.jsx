import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "../../../Pages/User/UserLogin";
import UserRegister from "../../../Pages/User/UserRegister";
import Registration_Otp from "../../../Pages/User/Registration_Otp";
import Test from "../../../Pages/User/Test";
import ForgotPasswrod from "../../../Pages/User/ForgotPasswrod";
import ChangePassword from "../../../Pages/User/ChangePassword";
import Test2 from "../../../Pages/User/Test2";
import Home from "../../../Pages/HomePage/Home";
import PrivateRoute from "../../PrivateRoutes/PrivateRouter";
import UserProfile from "../../../Pages/UserProfile/UserProfile";
import ProfileEdit from "../../../Pages/UserProfile/ProfileEdit";
import FriendsProfile from "../../../Pages/UserProfile/FriendsProfile";
import Search from "../../../Pages/Search/Search";
import Chat from "../../../Pages/Chat/Chat";
import UserPostView from "../../../Pages/UserProfile/UserPostView";
import EditPost from "../../../Pages/UserProfile/EditPost";
import Notification from "../../../Pages/Notification/Notification";






function UserWrapper() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserLogin />}></Route>
        <Route path="register" element={<UserRegister />}></Route>
        <Route path="otp" element={<Registration_Otp />}></Route>
        <Route path="test" element={<Test />}></Route>
        <Route path="test2" element={<Test2 />}></Route>
        <Route path="forgot-password" element={<ForgotPasswrod />}></Route>
        <Route path="change-password" element={<ChangePassword />}></Route>
        
        

        <Route
          path="home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="user-profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="user-profile-edit"
          element={
            <PrivateRoute>
              <ProfileEdit />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="friend-profile/:username" // Dynamic route parameter for username
          element={
            <PrivateRoute>
              <FriendsProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="search" // Dynamic route parameter for username
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="chat" // Dynamic route parameter for username
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
          
        
        />
        <Route
          path="notification" // Dynamic route parameter for username
          element={
            <PrivateRoute>
              <Notification/>
            </PrivateRoute>
          }
        />

  <Route path="/user/post/:postId" element={<PrivateRoute><UserPostView/></PrivateRoute>} />
  <Route path="/post/edit/:postId" element={<PrivateRoute><EditPost/></PrivateRoute>} />

      </Routes>
    </div>
  );
}

export default UserWrapper;
