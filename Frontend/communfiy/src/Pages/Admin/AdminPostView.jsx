import React, { useState, useEffect } from 'react';
import AdminMenuBar from '../../Components/AdminNavbar/AdminMenuBar';
import AdminSideBar from '../../Components/AdminNavbar/AdminSideBar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPostView() {
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate(); 
    const location = useLocation();
    const postId = location.pathname.split('/').pop();
    const [post, setPost] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2


    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await axios.get(baseUrl + `/api/home/post/${postId}/`);
            setPost(response.data);
          } catch (error) {
            console.error('Error fetching post:', error);
          }
        };

        fetchPost();
      }, [postId]);

      const handleDelete = async () => {
        setShowConfirmation(true); // Show confirmation modal before deleting
      };
      const cancelDelete = () => {
        setShowConfirmation(false); // Hide confirmation modal if user cancels deletion
      };

      const confirmDelete = async () => {
        try {
            await axios.delete(baseUrl + `/api/home/admin/list-reported-posts/${postId}/`);
          await axios.delete(baseUrl+`/api/home/post/${postId}/delete/`);
          setShowConfirmation(false); 
          navigate('/admin/post-report');
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      };

  return (
    <div className='bg-zinc-200 h-100vh'>
      <AdminMenuBar setToggle={setToggle} toggle={toggle} />
      <div className='mr-40 '>
        <AdminSideBar toggle={toggle} />
      </div>
      <div className='ml-8 sm:ml-20 mt-12 sm:pl-20 md:ml-22 md:mr-auto md:pl-20 lg:ml-5 lg:mr-40 flex-grow'>
        <div className="w-full flex flex-row flex-wrap justify-center bg-zinc-200 ">
          <div className="w-full h-auto flex flex-row flex-wrap justify-center bg-zinc-200">
            <div className="w-full md:w-3/4 lg:w-4/5 pb-3 pl-3 pr-3 md:px-12 lg:px-24 h-auto antialiased bg-zinc-200 ">
              <div className="mt-3 flex flex-col rounded-lg ">
                <div className="bg-white mt-3 pt-2 px-2 pb-2 bg-green rounded-lg">
                  <div className="bg-white mb-2 pl-3 text-xl text-gray-700 font-semibold flex items-start"></div>
                  {post ? ( 
                    <div>  
                       <img
                        src={post.image_url}
                        alt="Post"
                        className="rounded-lg mt-5 h-custom3 w-full ml-2 pr-3 object-cover"
                      /> 
                      <div className='ml-2 flex items-start'>
                        <div className='mr-2'>{post.username}</div>
                        {post.caption}
                      </div>
                      <div className="bg-white ml-2 pb-1 text-gray-700 text-xs font-semibold flex items-start">
                        {post.created_at}
                      </div>
                      <div className="flex ml-2 mt-2">
                        <button onClick={handleDelete}  className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                      <p>Loading post...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-3">Are you sure you want to delete this post?</p>
            <div className="flex justify-center">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-3">Yes</button>
              <button onClick={cancelDelete} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPostView;
