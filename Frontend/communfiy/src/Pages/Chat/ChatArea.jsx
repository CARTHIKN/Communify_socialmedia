  import React, { useState, useEffect, useRef } from 'react';
  import { useSelector } from 'react-redux';
  import axios from "axios";
  import { formatDistanceToNow } from 'date-fns';

  function ChatArea({ selectedUsername, socket,setTrigger,trigger, roomNamee }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    const [roomName, setRoomName] = useState(null);
    const baseUrl = "https://communify.sneaker-street.online";
    const username = useSelector((state) => state.authentication_user.username);
    const wsBaseUrl = "wss://127.0.0.1:8002/ws/chat/";
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };

    const handleIconClick = () => {
      fileInputRef.current.click(); // Trigger file input click
    };

    const handleFileInputChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result); // Update selected image with file content
        };
        reader.readAsDataURL(file);
      }
    };

    const handleCancelClick = () => {
      setSelectedImage(null); // Clear selected image
      fileInputRef.current.value = null; // Clear file input value
    };

    const handleSendClick = async () => {
      if (roomNamee) {
        let content = message;
        if (selectedImage) {
          setIsLoading(true);
          const imageLink = await uploadImageToCloudinary(selectedImage);
          content = imageLink;
          setSelectedImage(null); 
          fileInputRef.current.value = ''; 
          setIsLoading(false);
        }
        if (content.trim() !== '') {
          sendMessage(content, selectedImage ? 'media' : 'text'); // Send message or image link with appropriate m_type
        } else {
          console.warn('Message or image content is empty.');
        }
      } else {
        console.warn('Room name is not available.');
      }
    };

    const uploadImageToCloudinary = async (image) => {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', "mvdbhbcs");

      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dfu6jfpqk/image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        return res.data.secure_url; // Return the uploaded image link
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return null;
      }
    };

    const sendMessage = (content, m_type) => {
     
        
        try {
          const data = {
            message: content,
            m_type: m_type,
          };
          console.log(data);
          socket.send(JSON.stringify(data));
          setMessage('');
          // fetchChatRooms();
          setTrigger(!trigger)
        } catch (error) {
          console.error('Error sending message:', error);
        }
        
      socket.onclose = () => {
        console.log('WebSocket connection closed.');
      };
    };

if (socket!==null){
    socket.onmessage = (event) => {
      fetchMessages();
      setTrigger(!trigger)

      axios.post(baseUrl+ '/api/chat/mark-messages-as-seen/', {
        room_name: roomNamee,  
        username: username     
      })
      .then(response => {
        console.log('Messages marked as seen:', response.data);
      })
      .catch(error => {
        console.error('Error marking messages as seen:', error);
      });
      
    };
  }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default behavior of Enter key
        handleSendClick();
      }
    };
    

    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(baseUrl + '/api/chat/messages/', {
          params: {
            room: roomNamee,
          },
        });

        if (res.status === 202) {
          setMessages(res.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    

    useEffect(() => {
      fetchMessages()
    }, [roomNamee]);
    
    return (
      <div>
        {selectedUsername ? (
          <div className="overflow-hidden h-custom mt-2">
            <div className="w-full flex-1 px-5 h-full overflow-y-auto flex flex-col justify-between">
              <div className="flex flex-col mt-5">{isLoading && (
            <div class="w-full gap-x-2 flex mt-60 justify-center items-center">
                <div class="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
                <div class="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
                <div class="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
            </div>
            )}

            {messages && messages.length > 0 ? (
            messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.user.username === username ? 'justify-end' : 'justify-start'} mb-4`}>
                  {msg.m_type === 'media' ? (
                    // Render message as an image if m_type is 'media'
                    <div className="flex items-center">
                      <div className="w-64 h-48 ml-10 object-cover rounded-lg overflow-hidden">
                        <img src={msg.content} alt="Media" className="w-64 h-48 object-cover" />
                      </div>
                      <div className="text-smaller text-zinc-200 ml-2">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  ) : (
                    // Render text message
                    <div className={`pt-1 px-2 bg-${msg.user.username === username ? 'blue' : 'blue'}-400 rounded-bl-xl rounded-tl-xl rounded-tr-xl text-white`}>
                      {msg.content}
                      <div className="text-smaller text-zinc-200">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
                  <p>No messages available.</p>
                )}
              </div>
              <div className="flex pl-5 pt-5 mt-10 bg-green-300 pr-2 py-4 px-2 sticky bottom-0 bg-zinc-200 z-10">
                <div className="relative w-full pr-2 flex-grow">
                  {selectedImage ? (
                    <div className='w-full pb-2 bg-white px-4  py-6 h-96 flex items-center rounded'>
                        <img src={selectedImage} alt="Selected" className="w-full h-full object-cover object-center rounded" />
                        <div className='mt-2'>
                        <button
                          className="absolute top-2 right-2 pb-10  text-white rounded px-2 py-1"
                          onClick={handleCancelClick}
                        >
                          {/* Replace the "Cancel" button with the SVG icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6" style={{ color: 'red' }}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </button>
                        </div>
                        
                      </div>
                  ) : (
                    <div className="relative w-full">
                      <input
                        className="w-full bg-gray-300 py-3 px-3 pl-10 rounded-xl"
                        type="text"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={handleMessageChange}
                        onKeyPress={handleKeyPress}
                      />
                      <button
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                        onClick={handleIconClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-full h-full"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-shrink">
                  <button
                    type="button"
                    onClick={handleSendClick}
                    className="text-white bg-blue-400 hover:bg-blue-800  font-medium rounded-lg text-sm px-4 py-3 pb-4 me-2 dark:bg-blue-400 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-80 text-lg text-zinc-400">Select Users to chat</div>
        )}
        {/* Hidden file input for selecting image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </div>
    );
  }

  export default ChatArea;
