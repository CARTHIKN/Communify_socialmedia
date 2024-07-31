import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const pageSize = 10; // Number of users per page
    const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/accounts/admin/users/?page=${currentPage}&page_size=${pageSize}`);
                setUsers(response.data.results); // Update users with paginated data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentPage]); // Trigger fetchUsers when currentPage changes

    const handleEdit = async (userId, isBlocked) => {
        try {
            const action = isBlocked ? 'unblock' : 'block';
            await axios.patch(`${baseUrl}/api/accounts/admin/users/${userId}/`, { action });

            // Fetch updated user list after editing
            const response = await axios.get(`${baseUrl}/api/accounts/admin/users/?page=${currentPage}&page_size=${pageSize}`);
            const updatedUsers = response.data.results;

            // Sort the updated users list based on ID to maintain order
            updatedUsers.sort((a, b) => a.id - b.id);
            
            setUsers(updatedUsers); // Update users with sorted list
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ensure currentPage doesn't go below 1
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div>
            <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
                <div className="flex items-center justify-between pb-6">
                    <div>
                        <h2 className="font-semibold text-gray-700">Users Lists</h2>
                        <span className="text-sm text-gray-500">View accounts of registered users</span>
                    </div>
                </div>
                <div className="overflow-y-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                                    <th className="px-5 lg:pl py-3">ID</th>
                                    <th className="px-5 lg:pl-9 py-3">Username</th>
                                    <th className="px-5 lg:pl-20 py-3">Email</th>
                                    <th className="px-5 lg:pl-10 py-3">Phone</th>
                                    <th className="px-5 lg:pl-10 py-3">Status</th>
                                    <th className="px-5 lg:pl-16 py-3">Block / UnBlock</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500">
                                {users.map((user, index) => (
                                    <tr key={index} className="bg-white border-b border-gray-200">
                                        <td className="px-5 lg:pr20 py-3">{user.id}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="whitespace-no-wrap">{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5  py-3">{user.email}</td>
                                        <td className="px-5 py-3">{user.phone}</td>
                                        <td className="px-5 py-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_blocked ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>
                                                {user.is_blocked ? 'Inactive' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => handleEdit(user.id, user.is_blocked)} className=" ml-4 bg-zinc-800 rounded-full px-4 py-1 text-xs text-white font-semibold">{user.is_blocked ? 'Unblock' : 'Block'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
                        <span className="text-xs text-gray-600 sm:text-sm"> Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, users.length)} of {users.length} Entries </span>
                        <div className="mt-2 inline-flex sm:mt-0">
                            <button onClick={handlePrevPage} className="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">Prev</button>
                            <button onClick={handleNextPage} className="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;
