import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MenuBar from '../../Components/NavBar/MenuBar';
import SideBar from '../../Components/NavBar/Sidebar';
import FriendsProfileWithBio from './FriendsProfileWithBio';

import OthersPost from './OthersPost';

function FriendsProfile() {
  const { username } = useParams(); // Get the username from the URL
  const [friendData, setFriendData] = useState(null);



  return (
    <div className='bg-zinc-200'>
        <div>
        <MenuBar/>
      </div>

      <div className='mr-40 '>
        <SideBar />
      </div>
      <div className='pt-12 w- sm:mt-12 sm:ml-20 sm:pl-20 md:mt-10 md:ml-22 md:mr-auto md:pt-2 md:pl-20 lg:pt-16'>
        <FriendsProfileWithBio friend_username={username}/>
      </div>
      <div className='sm:ml-20 sm:pl-20 md:ml-22 md:mr-auto  md:pl-80 lg:ml-5 lg:mr-40'>
        <OthersPost friend_username={username}/>
      </div>
    </div>
  );
}

export default FriendsProfile;
