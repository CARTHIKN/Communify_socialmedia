import React from 'react';
import AdminLogin from '../../Pages/Admin/AdminLogin';
import AdminHome from '../../Pages/Admin/AdminHome';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminPrivateRoute from '../PrivateRoutes/AdminPrivateRoute';
import PostReport from '../../Pages/Admin/PostReport';
import AdminPostView from '../../Pages/Admin/AdminPostView';
import CommentReport from '../../Pages/Admin/CommentReport';

function AdminWrapper() {
    const isAuthenticated =useSelector((state) => state.authentication_user.isAuthenticated);
      const isAdmin = useSelector(
        (state) => state.authentication_user.isAdmin
      );
    
  return (
    <div>
      <Routes>
      <Route path="" element={<AdminLogin/>}></Route>

      <Route path="home" element= { <AdminPrivateRoute><AdminHome/></AdminPrivateRoute> }></Route>
      
      <Route path="post-report" element= { <AdminPrivateRoute><PostReport/></AdminPrivateRoute> }></Route>
      <Route path="post-view/:postId" element= { <AdminPrivateRoute><AdminPostView/></AdminPrivateRoute> }></Route>

      <Route path="comment-report" element= { <AdminPrivateRoute><CommentReport/></AdminPrivateRoute> }></Route>


      

      </Routes>
    </div>
  )
}

export default AdminWrapper
