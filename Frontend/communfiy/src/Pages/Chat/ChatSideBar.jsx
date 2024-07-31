import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import user2 from "../../images/user2.jpg";
import { useChatNotification } from '../../Context/ChatNotificationContext';


function ChatSideBar({ selectedUsername, profilePicture, onUserClick, socket,setSocket, trigger,setRoomNamee  }) {
  const { chatNotificationCount } = useChatNotification();
  const username = useSelector((state) => state.authentication_user.username);
  const [chatrooms, setChatRooms] = useState([]);
  const [opened, setOpened] = useState(selectedUsername ? selectedUsername : null);
  const [userProfiles, setUserProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [lastMessages, setLastMessages] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [sockett, setSockett] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  



  const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2
  const wsBaseUrl = 'communify.sneaker-street.online';
  // const baseUrl3 = "https://communify.sneaker-street.online";

  useEffect(() => {
    const fetchChatRooms = async () => {
      const formData = { username: username };
      try {
        const res = await axios.post(baseUrl + '/api/chat/chatrooms/', formData);
    
        if (res.status === 200) {
          setChatRooms(res.data);
    
          const profilePromises = res.data.map(async (user) => {
            try {
              const profileRes = await axios.get(baseUrl+`/api/accounts/user-profile-picture/${user.username}`);
              return { ...user, profilePicture: profileRes.data.profile_picture };
            } catch (error) {
              console.error(`Error fetching profile picture for user ${user.username}:`, error);
              return { ...user, profilePicture: null };
            }
          });
    
          const profiles = await Promise.all(profilePromises);
          const userProfileMap = profiles.reduce((acc, profile) => {
            acc[profile.username] = profile;
            return acc;
          }, {});
    
          setUserProfiles(userProfileMap);
    
          // Fetch unseen messages for each room
          const unseenMessagesPromises = res.data.map(async (room) => {
            try {
              const unseenRes = await axios.get(baseUrl+ `/api/chat/unseen-messages/?roomid=${room.room_id}&username=${username}`);
              return { roomId: room.room_id, count: unseenRes.data.count };
            } catch (error) {
              console.error(`Error fetching unseen messages for room ${room.room_id}:`, error);
              return { roomId: room.room_id, count: 0 };
            }
          });
    
          const unseenMessagesData = await Promise.all(unseenMessagesPromises);
          const unseenMessagesMap = unseenMessagesData.reduce((acc, messageData) => {
            acc[messageData.roomId] = messageData.count;
            return acc;
          }, {});
    
          setUnseenMessages(unseenMessagesMap);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };
    

    fetchChatRooms();
    
  }, [baseUrl, username,socket, trigger,chatNotificationCount]);



  useEffect(() => {
    const fetchLastMessages = async () => {
      const roomIds = chatrooms.map(room => room.room_id); // Assuming each room has an 'id' property
  
      try {
        const lastMessagesData = await Promise.all(
          roomIds.map(async roomId => {
            try {
              const res = await axios.get(baseUrl+ `/api/chat/lastmessage/?roomid=${roomId}`);
              return { roomId, message: res.data.content };
            } catch (error) {
              console.error(`Error fetching last message for room ${roomId}:`, error);
              return { roomId, message: null }; // Return null if no message is found
            }
          })
        );
  
        const lastMessagesMap = lastMessagesData.reduce((acc, messageData) => {
          acc[messageData.roomId] = messageData.message;
          return acc;
        }, {});
  
        setLastMessages(lastMessagesMap);
      } catch (error) {
        console.error("Error fetching last messages:", error);
      }
    };
  
    fetchLastMessages();
  }, [baseUrl, chatrooms]);

  const fetchRoom = async (username2) => {
    try {
      const res = await axios.get(baseUrl + '/api/chat/findroom/', {
        params: {
          user1: username,
          user2: username2,
        },
      });

      if (res.status === 200) {
        setRoomName(res.data.name);
        setRoomNamee(res.data.name)
      }
    } catch (error) {
      if (error.response && error.response.status === 406) {
        console.log("error");
      } else {
        console.log("error-2");
      }
    }
  };

  useEffect(() => {
    
    if (roomName) {
      if (socket!==null){
        socket.close()
      }
      const wsUrl = `wss://communify.sneaker-street.online/ws/chat/${roomName}/${username}/`;
      const ws = new WebSocket(wsUrl);
      
      // setSocket(ws)
  
      ws.onopen = () => {
       
        console.log('WebSocket connection established.');
        setSocket(ws); // Save the WebSocket connection to state
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = () => {
        console.log('WebSocket connection closed.');
        setSocket(null)
      };
    }
  }, [roomName]);


  const handleUserClick = async (username3) => {
    setOpened(username3);
    onUserClick(username3);
    await fetchRoom(username3);
    
  };


  useEffect(() => {
    if (selectedUsername) {
      const fetchRoomAndSetSocket =  () => {
        fetchRoom(selectedUsername);
        
        
        // createWebSocket();
      };
      fetchRoomAndSetSocket();
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = chatrooms.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full border-r-2 border-zinc-400 mt-16 overflow-y-auto max-h-screen">
      <div className="border-b-2 border-zinc-400 py-4 px-2 sticky top-0 bg-zinc-200 z-10">
        <input
          type="text"
          placeholder="Search chat"
          className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="flex flex-col">
        {selectedUsername && !chatrooms.some(user => user.username === selectedUsername) && !searchQuery && (
          <div
            // onClick={handleUserClick2}
            style={{ cursor: 'pointer' }}
            className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 border-zinc-300 ${opened === selectedUsername ? 'bg-blue-200' : ''}`}
          >
            <div className="w-1/4">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  className="object-cover h-12 w-12 rounded-full"
                  alt=""
                />
              ) : (
                <img
                  src={user2}
                  className="object-cover h-12 w-12 rounded-full"
                  alt="Default Profile"
                />
              )}
            </div>
            <div className="w-96">
              <div className="text-lg font-semibold">{selectedUsername}</div>
              <span className="text-gray-500 pr-10">{lastMessages[selectedUsername]}</span>
            </div>
          </div>
        )}

        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className={`flex flex-row py-4 px-4 justify-center items-center border-b-2 border-zinc-300 ${opened === user.username ? 'bg-blue-200' : ''}`}
            onClick={() => handleUserClick(user.username)}
            style={{ cursor: 'pointer' }}
          >
            <div className="w-1/4">
              {userProfiles[user.username] && userProfiles[user.username].profilePicture ? (
                <img
                  src={userProfiles[user.username].profilePicture}
                  className="object-cover h-12 w-12 rounded-full"
                  alt=""
                />
              ) : (
                <img
                  src={user2}
                  className="object-cover h-12 w-12 rounded-full"
                  alt="Default Profile"
                />
              )}
            </div>
            <div className="w-full">
              <div className="text-lg mr-10 font-semibold">{user.username}</div>
              <div className="text-xs font-semibold w-20 ml-20 mr-24 mtext-center"><span className="text-gray-500">{ lastMessages[user.room_id]}</span>
              {unseenMessages[user.room_id] > 0 && (
                 <span class="shrink-0 rounded-full bg-indigo-500 px-2 font-mono text-md font-medium tracking-tight text-white ml-2">
                  {unseenMessages[user.room_id]}
               </span>
            
                
              )}
              
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSideBar;
