import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentReportList() {
    const [reportedComments, setReportedComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false);


    useEffect(() => {
        const fetchReportedComments = async () => {
            try {
                const response = await axios.get('https://communify.sneaker-street.online/api/home/admin/list-reported-comments/');
                setReportedComments(response.data);
            } catch (error) {
                console.error('Error fetching reported comments:', error);
            }
        };

        fetchReportedComments();
    }, []);

    const handleDelete = async (commentId) => {
        setDeleteCommentId(commentId)
        setShowConfirmation(true)
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Hide confirmation modal if user cancels deletion
      };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://communify.sneaker-street.online/api/home/admin/list-reported-comments/${deleteCommentId}/delete/`);
            setReportedComments(reportedComments.filter(comment => comment.comment_id !== deleteCommentId));
            setDeleteCommentId(null)
            setShowConfirmation(false)
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
      };

    return (
        <div>
            {reportedComments.length === 0 ? (
                <p className="text-center text-gray-500 my-4">No reported comments.</p>
            ) : (
            <ul role="list" className="divide-y-2 my-2 divide-zinc-300 ">
                {reportedComments.map((comment) => (
                    <li key={comment._id} className="flex justify-between gap-x-6 bg-white rounded px-4 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{comment.posted_by}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{comment.content}</p>
                            </div>
                        </div>
                        <div className='ml-10'>
                        <p className="mt-1  truncate text-xs leading-5 text-gray-500">Reported Count: {comment.count}</p>

                        </div>
                        <div className="hidden shrink-0 mt-2 sm:flex sm:flex-col sm:items-end">
                            <button onClick={() => handleDelete(comment.comment_id)} className="text-red-500">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
              )}
            {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-3">Are you sure you want to delete this comment?</p>
            <div className="flex justify-center">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-3">Yes</button>
              <button onClick={cancelDelete} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
}

export default CommentReportList;
