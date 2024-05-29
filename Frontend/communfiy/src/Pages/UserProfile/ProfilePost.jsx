import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function ProfilePost() {
  const username = useSelector((state) => state.authentication_user.username);
  const [posts, setPosts] = useState([]);
  const baseUrl = "http://127.0.0.1:8001";
  const [activeTab, setActiveTab] = useState('yourPosts');
  const [savedPostIds, setSavedPostIds] = useState([])
  const [savedPosts, setSavedPosts] = useState([])

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(baseUrl +`/api/home/user/posts/?username=${username}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [username]);

  useEffect(() => {
  
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.post(baseUrl +'/api/home/user/fetch-saved-post/', { username:username });
        const { saved_posts } = response.data;
        setSavedPostIds(saved_posts);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };
    fetchSavedPosts()
  }, []); 
  

  const handleTabClick = (tab) => {
    setActiveTab(tab); 
    if (tab === 'savedPosts') {
      const fetchSavedPostsByIds = async () => {
        try {
          const fetchedPosts = [];
          for (const postId of savedPostIds) {
            const response = await axios.get(`${baseUrl}/api/home/post/${postId}`);
            fetchedPosts.push(response.data); 
            
          }
          setSavedPosts(fetchedPosts);
        } catch (error) {
          console.error('Error fetching saved posts by ids:', error);
        }
      };

      fetchSavedPostsByIds();
    }
  };

  

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <button
          className={`w-full py-2 border-b-4  ${activeTab === 'yourPosts' ? 'border-zinc-400' : 'border-b-4'}`}
          onClick={() => handleTabClick('yourPosts')} // Update active tab on click
        >
          Your Posts
        </button>
        <button
          className={`w-full py-2 border-b-4 ${activeTab === 'savedPosts' ? 'border-zinc-400' : 'border-b-2'}`}
          onClick={() => handleTabClick('savedPosts')} // Update active tab on click
        >
          Saved Posts
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 my-3">
        {activeTab === 'yourPosts' ? (
          posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} to={{ pathname: `/user/post/${post.id}`, state: { post } }}>
                <div>
                  <a
                    className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg"
                    href="#"
                    style={{ backgroundImage: `url('data:image/jpeg;base64,${post.image_url}')` }}
                  ></a>
                </div>
              </Link>
            ))
          ) : (
            <p>No posts found.</p>
          )
        ) : (
        
          savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              
                <div>
                  <a
                    className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg"
                    href="#"
                    style={{ backgroundImage: `url('${post.image_url}')` }}
                  ></a>
                </div>
              
            ))
          ) : (
            <p>No saved posts found.</p>
          )
        )}
      </div>
    </div>
  );
}

export default ProfilePost;
