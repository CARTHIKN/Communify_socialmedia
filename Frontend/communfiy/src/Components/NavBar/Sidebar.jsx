
import React, { useState,useEffect } from 'react';
import { useSelector} from 'react-redux';
// import { useChatNotification } from '../../Context/ChatNotificationContext';
import { useChatNotification } from '../../Context/ChatNotificationContext';
import axios from 'axios';

export default function SideBar(props) {
  // const { incrementChatNotificationCount } = useChatNotification();
  const { chatNotificationCount,showNotification } = useChatNotification();

  const [isSidebarOpen, setIsSidebarOpen] = useState(props.toggle);
  // const [socket, setSocket] = useState(null);
  const [chatNotificationCounts, setChatNotificationCounts] = useState(0); 
  const [notificationcount, setNotificationCount] = useState(0)
  const username = useSelector((state) => state.authentication_user.username);
  const baseUrl3 = import.meta.env.VITE_BASE_URL
  const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2


  useEffect(() => {
    setIsSidebarOpen(props.toggle);
  }, [props.toggle]);



  

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(baseUrl+ '/api/home/user/notification-count/', {
          params: {
            username: username
          }
        });

        setNotificationCount(response.data.notification_count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showNotification]);

  useEffect(() => {
    try {
      axios.get(`${baseUrl}/api/chat/all-unseen-messages/${username}/`)
        .then((res) => {
          if (res.status === 200) {
            setChatNotificationCounts(res.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [chatNotificationCount]);
  
  const markNotificationsAsSeen = async () => {
    try {
        await axios.post(baseUrl+'/api/home/user/mark-notification-as-seen/', {
            username: username 
        });
        setNotificationCount(0); 
    } catch (error) {
        console.error('Error marking notifications as seen:', error);
    }
};

  return (
    <div >
        <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-zinc-700 sm:translate-x-0 dark:bg-zinc-800 dark:border-indigo-700`} aria-label="Sidebar">
      <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-zinc-800">
      <ul class="space-y-2 font-medium">
          
      <li>
          <a href="/home" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>

            <span class="flex-1 ms-3 whitespace-nowrap">Home</span>
          </a>
        </li>

        <li>
          <a href="/search" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>


            <span class="flex-1 ms-3 whitespace-nowrap">Search</span>
          </a>
        </li>
        <li>
          <a href="/chat" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>



            <span class="flex-1 ms-3 whitespace-nowrap">Message</span>
            {chatNotificationCounts > 0 && (
              <span class="shrink-0 rounded-full bg-white px-2 font-mono text-xs font-medium tracking-tight text-black ml-2">{chatNotificationCounts}</span>
                  // <span className="flex-1 ms-3 whitespace-nowrap"></span>
            )}
          </a>
        </li>
        <li>
          <a href="/notification" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
            <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
          </svg>




            <span class="flex-1 ms-3 whitespace-nowrap" onClick={markNotificationsAsSeen}>Notifications</span>
            {notificationcount > 0 && (
              <span class="shrink-0 rounded-full bg-white px-2 font-mono text-xs font-medium tracking-tight text-black ml-2"  >{notificationcount}</span>
                  // <span className="flex-1 ms-3 whitespace-nowrap"></span>
            )}
          </a>
        </li>


      </ul>
      </div>
      </aside>

      
      
        
        
    </div>
  );
}