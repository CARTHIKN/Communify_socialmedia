import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userimg from "../../images/user.png"


function ProfileWithBio() {
    const username = useSelector((state) => state.authentication_user.username);
    const [userData, setUserData] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [postCount, setPostCount] = useState(0);


    const baseUrl = "https://communify.sneaker-street.online";
    const baseUrl2 = "https://communify.sneaker-street.online";


    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const res = await axios.get(`${baseUrl}/api/accounts/user-profile-picture/${username}/`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (res.status === 200) {
              setUserData(res.data)
            }
            return res;
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        };

        const fetchFollowerFollowingCount = async () => {
          try {
              const res = await axios.get(`${baseUrl2}/api/home/user/friends-count/${username}/`);
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
      }, [baseUrl,baseUrl2, username]);
    
  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
          <img
              className="block mx-auto w-20 h-20 rounded-full border border-gray-400 shadow-lg object-cover object-center"
              href=""
              src={userData? userData.profile_picture? userData.profile_picture: userimg :userimg}
            />
            <p className="font-serif font-semibold">{username}</p>
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
            <Link to="/user-profile-edit">
            <button className="bg-zinc-800 px-5 py-1 rounded-full text-white shadow-lg">Edit</button>
            </Link>
          </div>

          
        </div>

        {/* <div className="flex justify-between items-center bg-yellow-600 bg-opacity-20 px-10 py-5 rounded-full text-gray-500">
       
        </div> */}

      </div>
    </div>
  )
}

export default ProfileWithBio
