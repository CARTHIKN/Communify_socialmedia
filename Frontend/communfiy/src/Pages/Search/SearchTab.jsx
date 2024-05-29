import React, { useState } from 'react';
import axios from 'axios';
import user2 from "../../images/user2.jpg"
import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function SearchTab() {
    const username = useSelector((state) => state.authentication_user.username);    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const baseUrl = "http://127.0.0.1:8000";
    const token = localStorage.getItem("access");

    const handleSearch = async (query) => {
        try {
            setIsLoading(true);
            const response = await axios.get(baseUrl + `/api/accounts/search/?username=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Note the space after Bearer
                    Accept: "application/json",
                    "Content-Type": "application/json", // Corrected typo in "application/json"
                }
            });
            setSearchResults(response.data.users);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value);
        handleSearch(value);
    };

    return (
        <div>
            <label className="mx-auto relative bg-white lg:w-120 flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300" htmlFor="search-bar">
                <input
                    id="search-bar"
                    placeholder="Enter username"
                    className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
                    value={searchQuery}
                    onChange={handleChange}
                />
                <button
                    className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
                >
                    <div className="relative">
                        <div className="flex items-center justify-center h-3 w-3 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transition-all">
                            {isLoading && (
                                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 11-16 0 8 8 0 0116 0z"></path>
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center transition-all opacity-1 valid:">
                            <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                                Search
                            </span>
                        </div>
                    </div>
                </button>
            </label>

            {/* Display search results or no results message */}
            {isLoading && <p>Loading...</p>}
            {!isLoading && searchResults.length === 0 && (
                <div className='mt-56 mr-24 text-zinc text-sm'>
                    <p>No results found .</p>
                </div>
                
            )}
            {!isLoading && searchResults.length > 0 && (
                <div className='pt-5 mx-auto relative mr-6'>
                    <Card className="p-2 ml-0 md:ml-5"> {/* Adjust margin-left based on screen size */}
                        <List>
                            {searchResults.map((user) => (
                                <ListItem key={user.username} className="border my-1">
                                    <ListItemPrefix>
                                        <Avatar variant="circular" alt={user.username} src={user.profile_picture? user.profile_picture:user2} />
                                    </ListItemPrefix>
                                    <div className='ml-4'>
                                    <Typography variant="h6" color="blue-gray">
                                            {username === user.username ? (
                                                <Link to="/user-profile">{user.username}</Link>
                                            ) : (
                                                <Link to={`/friend-profile/${user.username}`}>{user.username}</Link>
                                            )}
                                        </Typography>
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default SearchTab;
