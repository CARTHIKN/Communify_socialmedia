import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useChatNotification } from '../../Context/ChatNotificationContext';
import { Link } from 'react-router-dom';
import comment from  '../../assets/comment.jpg'
import like from '../../assets/like.jpg'
const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const { showNotification } = useChatNotification();
    const username = useSelector((state) => state.authentication_user.username);

    const baseUrl1 = "https://communify.sneaker-street.online";

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(baseUrl1 + '/api/home/user/all-notification/', {
                    params: {
                        username: username
                    }
                });
                // Assuming response.data is already an array of objects
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        markNotificationsAsSeen();
    }, [showNotification]);
    const markNotificationsAsSeen = async () => {
        try {
            await axios.post('https://communify.sneaker-street.online/api/home/user/mark-notification-as-seen/', {
                username: username
            });
             // Update the notification count locally
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
        }
    };

    return (
        <div>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification._id}>
                            <Link key={notification.id} to={{ pathname: `/user/post/${notification.post_id}` }}>
                            <div className=" my-2 dark:bg-gray-300 bg-gray-700 py-1 rounded-md flex sm:gap-4 xs:gap-2 items-center justify-center">
                                <img src={notification.notification_type === 'like' ? like : notification.notification_type === 'comment' ? comment : like} alt="profile" className="w-12 object-cover h-12 outline outline-2 outline-blue-400 dark:outline-teal-400/20 rounded-full" />
                                <div className="w-[80%] flex flex-col gap-1">
                                    <div className="text-lg font-semibold font-serif text-white dark:text-black">{notification.by_user}</div>
                                    <p className="text-sm dark:text-gray-600 text-gray-300">
                                         {notification.notification_type === 'like' ? 'liked your post' : notification.notification_type === 'comment' ? 'commented on your post' : 'unknown notification type'}
                                    </p>
                                    <p className="text-sm dark:text-gray-600 text-gray-300"> {notification.created_at}</p>
                                </div>
                            </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
};

export default NotificationList;
