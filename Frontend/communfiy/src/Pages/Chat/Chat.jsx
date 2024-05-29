import React, { useState } from 'react';
import MenuBar from '../../Components/NavBar/MenuBar';
import ChatSideBar from './ChatSideBar';
import ChatArea from './ChatArea';
import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const friendUsername = location.state?.friendUsername;
  const profilePicture = location.state?.profilePicture;

  // State to hold the selected username
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [socket,setSocket] = useState(null)
  const [trigger,setTrigger] = useState(true)
  const [roomNamee,setRoomNamee] = useState(null)

  // Function to handle user click in ChatSideBar
  const handleUserClick = (username) => {
    setSelectedUsername(username);
  };
  if (friendUsername && !selectedUsername) {
    setSelectedUsername(friendUsername);
  }
  
  return (
    <div className='flex h-custom'>
      <MenuBar />
      <div className='w-96 h-custom2'>
        <ChatSideBar
          selectedUsername={friendUsername}
          profilePicture={profilePicture}
          setSocket={setSocket}
          socket={socket}
          onUserClick={handleUserClick} // Pass the click handler to ChatSideBar
          trigger={trigger}
          setRoomNamee={setRoomNamee}
        />
      </div>
      <div className='flex flex-col flex-1 pt-12'>
        <div className='flex-1'>
          {/* Pass selectedUsername to ChatArea */}
          <ChatArea selectedUsername={selectedUsername} socket={socket} setTrigger={setTrigger} trigger = {trigger} roomNamee={roomNamee}/>
        </div>
      </div>
    </div>
  );
}

export default Chat;
