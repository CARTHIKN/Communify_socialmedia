import React, { useState } from 'react';
import MenuBar from '../../Components/NavBar/MenuBar';
import SideBar from '../../Components/NavBar/Sidebar';
import PostUpload from './PostUpload';
import PostView from './PostView';
import ActiveUsers from './ActiveUsers';
import { useSelector } from 'react-redux';

function Home() {
  const isAuthenticated = useSelector((state) => state.authentication_user.isAuthenticated);
  console.log("homeeeeee", isAuthenticated);

  const [toggle, setToggle] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  return (
    <div className="bg-zinc-200 h-auto">
      <MenuBar setToggle={setToggle} toggle={toggle} />

      <div className='mr-40'>
        <SideBar toggle={toggle} />
      </div>

        <div className='ml-8 mt-12 sm:mt-12 sm:ml-20 sm:pl-20 md:mt-10 md:ml-22 md:mr-auto md:pl-20 lg:pt-4 lg:ml-36 lg:mr-10 '>
          <PostUpload toggle={toggle} setRefreshPosts={setRefreshPosts} />
        </div>

        <div className='ml-8 sm:ml-20 sm:pl-20 md:ml-22 md:mr-auto md:pl-20 lg:ml-36 lg:mr-10 flex-grow'>
          <PostView refreshPosts={refreshPosts} />
        </div>

      {/* <div>
        <ActiveUsers />
      </div> */}
    </div>
  );
}

export default Home;
