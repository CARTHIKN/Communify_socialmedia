import React, { useState, useEffect } from 'react';
import MenuBar from '../../Components/NavBar/MenuBar';
import SideBar from '../../Components/NavBar/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditPost() {
  const postId = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState('');


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://communify.sneaker-street.online/api/home/post/${postId}/`);
        setPost(response.data);
        setCaption(response.data.caption);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost(); // Fetch post data when component mounts

    // Clean up effect
    return () => {
      setPost(null); // Reset post data when component unmounts
      setCaption(''); // Reset caption when component unmounts
    };
  }, [postId]); // Include postId in the dependency array

  const handleCaptionChange = (event) => {
    setCaption(event.target.value); // Update caption state as user types
  };



  const handleSubmit = async () => {
    try {
      // Example POST request to update the post with the new caption
      const response = await axios.put(`http://127.0.0.1:8001/api/home/post/${post._id}/update/`, {
        caption: caption,
      });
      navigate(`/user/post/${post._id}`); // Redirect to the post view page after editing
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!post) {
    return <p>Loading post...</p>; // Add a loading indicator while fetching post data
  }

  return (
    <div className="bg-zinc-200 h-screen flex flex-col">
      <MenuBar setToggle={setToggle} toggle={toggle} />
      <div className="flex-1 flex overflow-hidden">
        <div className="mr-40">
          <SideBar toggle={toggle} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="ml-8 mt-12 sm:mt-12 sm:ml-20 sm:pl-20 md:mt-10 md:ml-22 md:mr-auto  md:pl-20 lg:pt-4 lg:ml-5 lg:mr-40">
            <div className="w-full flex flex-row flex-wrap justify-center">
              <div className="w-full md:w-3/4 lg:w-4/5 pt-3 pl-3  pr-3 md:px-12 lg:24 h-full antialiased">
                <div className="bg-white  h-custom5  shadow rounded-lg p-3 flex flex-row flex-wrap items-stretch">
                  <div className="flex flex-col items-center ">
                    <div className="flex flex-col items-center mb-3  h-custom6">
                      <img
                        src={post.image_url}
                        alt="Selected Image"
                        className="lg:w-auto  lg:h-custom6 w-custom2 sm:w-20 md:w-20 rounded-md "
                      />
                    </div>
                    <div className="w-full md:w-auto lg:flex-grow mt-4 ml-10 flex flex-row items-center">
                      <textarea
                        value={caption}
                        onChange={handleCaptionChange}
                        className="bg-gray-200 w-96 rounded-lg shadow border ml- mr-1 p-2 h-20 flex-grow"
                        rows="5"
                        placeholder="Caption for your post"
                      ></textarea>
                      <div className="ml-3">
                        <button
                          onClick={handleSubmit}
                          type="button"
                          className="bg-zinc-800 hover:bg-indigo-300 text-white p-2 rounded-lg"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;