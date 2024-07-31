import React from 'react'
import userimg from "../../images/user.png"
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



function FriendsProfileWithBio(props) {
    const navigate = useNavigate()
    const username = useSelector((state) => state.authentication_user.username);
    const friend_username = props.friend_username
    const [isFollowing, setIsFollowing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [postCount, setPostCount] = useState(0);

    const baseUrl = import.meta.env.VITE_BASE_URL
    const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
    const baseUrl1 = import.meta.env.VITE_BASE_URL_1
    const baseUrl2 = import.meta.env.VITE_BASE_URL_2


    const handleFollowClick = async () => {
        try {
            let res;
            if (isFollowing) {
                res = await axios.post(`${baseUrl}/api/home/user/unfollow/`, {
                    username: username,
                    friend_username: friend_username
                });
            } else {
                res = await axios.post(`${baseUrl}/api/home/user/follow/`, {
                    username: username,
                    friend_username: friend_username
                });
            }
            if (res.status === 201 ||  res.status === 200) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/home/user/check-following/${username}/${friend_username}`);
                if (res.status === 200) {
                    setIsFollowing(res.data.is_following);
                }
            } catch (error) {
                console.error("Error checking following status:", error);
            }
        };

        fetchData();
    }, [baseUrl, username, friend_username]);


      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const res = await axios.get(`${baseUrl}/api/accounts/user-profile-picture/${friend_username}/`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (res.status === 200 || res.status === 201) {
              
              setUserData(res.data)
            }
            return res;
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        };


        const fetchFollowerFollowingCount = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/home/user/friends-count/${friend_username}/`);
                if (res.status === 200) {
                    setFollowersCount(res.data.followers_count);
                    setFollowingCount(res.data.following_count);
                    setPostCount(res.data.post_count)

  
                }
            } catch (error) {
                console.error("Error fetching follower/following count:", error);
            }
        };
      
        fetchUserProfile();
        fetchFollowerFollowingCount();
      }, [baseUrl, friend_username,isFollowing]);

      const handleChatClick = () => {
        // Navigate to the Chat component with friend_username as parameter
        navigate(`/chat`, { state: { friendUsername: friend_username, profilePicture: userData?.profile_picture } }); // Updated navigation method
    };
    
  return (
    <div className='bg-zinc-200'>
      <div className="max-w-2xl mx-auto">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
          <img
              className="block mx-auto w-20 h-20 rounded-full border border-gray-400 shadow-lg object-cover object-center"
              href=""
              src={userData? userData.profile_picture? userData.profile_picture: userimg :userimg}
            />
            <p className="font-serif font-semibold">{props.friend_username}</p>
            <span className="text-sm text-gray-400">{userData? userData.bio? userData.bio: " " :" "}</span>
            <span className="text-sm text-gray-400">{userData? userData.dob? userData.dob: " " :" "}</span> 
            
          </div>

          <div className="flex justify-center items-center gap-2 my-3">
            <div className="font-semibold text-center mx-4">
              <p className="text-black">{postCount}</p>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="font-semibold text-center mx-4">
              <p className="text-black">{followersCount}</p>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="font-semibold text-center mx-4">
              <p className="text-black">{followingCount}</p>
              <span className="text-gray-400">Following</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 my-5">
            <button
                className={`bg-zinc-800 px-5 py-1 rounded-full text-white shadow-lg ${isFollowing ? 'bg-red-500' : ''}`}
                onClick={handleFollowClick}
            >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {isFollowing && (
                <button className="bg-blue-500 px-5 py-1 rounded-full text-white shadow-lg" onClick={handleChatClick} >Message</button>
            )}
          </div>

          
        </div>

        {/* <div className="flex justify-between items-center bg-yellow-600 bg-opacity-20 px-10 py-5 rounded-full text-gray-500">
       
        </div> */}

      </div>
    </div>
  )
}

export default FriendsProfileWithBio
