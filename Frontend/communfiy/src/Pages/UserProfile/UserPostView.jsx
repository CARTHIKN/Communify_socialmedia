import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import MenuBar from '../../Components/NavBar/MenuBar';
import SideBar from '../../Components/NavBar/Sidebar';
import { useSelector } from 'react-redux';


function UserPostView() {
  const location = useLocation();
  const postId = location.pathname.split('/').pop(); 
  const username = useSelector((state) => state.authentication_user.username);
  const [post, setPost] = useState(null);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate(); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [userLikesPost, setUserLikesPost] = useState(false);
  const [showComment,setShowComment] = useState(false)
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Prevent scrolling on the body when the component mounts
    document.body.style.overflow = 'hidden';

    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/api/home/post/${postId}/`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (postId) {
      fetchPost();
    }

    // Reset scrolling on the body when the component unmounts
    // return () => {
    //   document.body.style.overflow = 'auto';
    // };
  }, [postId]);

  const handleEdit = () => {
    navigate(`/post/edit/${postId}`); // Redirect to edit page using navigate
  };

  useEffect(() => {
    const checkUserLikesPost = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/home/user/check-user-likes/', {
          params: {
            username: username, 
            post_id: postId,
          },
        });
        setUserLikesPost(response.data.user_likes);
      } catch (error) {
        console.error('Error checking if user likes post:', error);
      }
    };

    checkUserLikesPost();

    // No clean up needed for this effect
  }, [postId]);

  useEffect(() => {
    const fetchLikeAndCommentCounts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/home/user/like-comments-count/', {
          params: {
            post_id: postId,
          },
        });
        const { likes_count, comments_count } = response.data;
        setLikeCount(likes_count);
        setCommentCount(comments_count);
      } catch (error) {
        console.error('Error fetching like and comment counts:', error);
      }
    };

    fetchLikeAndCommentCounts(); // Fetch counts when component mounts

    // No clean up needed for this effect
  }, [postId,userLikesPost,comment,replyContent]);

  const handleDelete = async () => {
    setShowConfirmation(true); // Show confirmation modal before deleting
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8001/api/home/post/${postId}/delete/`);
      setShowConfirmation(false); // Hide confirmation modal after successful deletion
      navigate('/user-profile'); // Redirect to user profile after successful deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async () => {
    try {
        const res = await axios.post('http://127.0.0.1:8001/api/home/user/post/like/', { postId: postId, username:username },);
        if (res.status === 200 || res.status === 201) {
          setUserLikesPost(!userLikesPost)
           
        }
    } catch (error) {
        console.error('Error liking/unliking post:', error);
    }
  };
  const handlecomments = (event) => {

    setComment(event.target.value);
   
  };

  const handleComment = async () => {
    try {
      const mainCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/${postId}/`);
      let mainCommentsData = mainCommentsResponse.data; // Assuming response.data is not always an array
      
      mainCommentsData = JSON.parse(mainCommentsData);
      
      // Now fetch replied comments for each main comment
      const fetchRepliedComments = async () => {
        const promises = mainCommentsData.map(async (mainComment) => {
          const repliedCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/replied-comments/?parent_comment_id=${mainComment._id}`);
          let repliedCommentsData = repliedCommentsResponse.data.replied_comments; // Assuming the response structure
          
          repliedCommentsData = repliedCommentsData;
          
          // Append replied comments to the main comment object
          mainComment.repliedComments = repliedCommentsData;
        });
  
        // Wait for all promises to resolve
        await Promise.all(promises);
      };
      setComments(mainCommentsData);
      
      await fetchRepliedComments();
      setShowComment(!showComment);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8001/api/home/user/comment/', {
        username: username,
        post_id: postId,
        content: comment,
      });
      setComment('');
  
      // Fetch updated main comments
      const mainCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/${postId}/`);
      let mainCommentsData = mainCommentsResponse.data; // Assuming response.data is not always an array
      mainCommentsData = JSON.parse(mainCommentsData);
    
  
      // Now fetch replied comments for each main comment
      const fetchRepliedComments = async () => {
        const promises = mainCommentsData.map(async (mainComment) => {
          const repliedCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/replied-comments/?parent_comment_id=${mainComment._id}`);
          let repliedCommentsData = repliedCommentsResponse.data.replied_comments; // Assuming the response structure
          repliedCommentsData = repliedCommentsData;
          // Append replied comments to the main comment object
          mainComment.repliedComments = repliedCommentsData;
        });
        // Wait for all promises to resolve
        await Promise.all(promises);
      };
  
      await fetchRepliedComments();
      setComments(mainCommentsData);

  
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false); // Hide confirmation modal if user cancels deletion
  };
  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleReplySubmit = async (parent_Username,post_id) => {
    try {
      const response = await axios.post('http://127.0.0.1:8001/api/home/user/comment/reply/', {
        username: username,
        parent_comment_id: replyingTo,
        content: replyContent,
        parendUsername: parent_Username,
        post_id:post_id

      });
      setReplyingTo(null); // Reset replyingTo state after successful reply
      setReplyContent('');
      // Fetch updated comments after replying
      const mainCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/${postId}/`);
      let mainCommentsData = mainCommentsResponse.data; // Assuming response.data is not always an array
      mainCommentsData = JSON.parse(mainCommentsData);
    
  
      // Now fetch replied comments for each main comment
      const fetchRepliedComments = async () => {
        const promises = mainCommentsData.map(async (mainComment) => {
          const repliedCommentsResponse = await axios.get(`http://127.0.0.1:8001/api/home/user/comment/replied-comments/?parent_comment_id=${mainComment._id}`);
          let repliedCommentsData = repliedCommentsResponse.data.replied_comments; // Assuming the response structure
          repliedCommentsData = repliedCommentsData;
          // Append replied comments to the main comment object
          mainComment.repliedComments = repliedCommentsData;
        });
        // Wait for all promises to resolve
        await Promise.all(promises);
      };
  
      await fetchRepliedComments();
      setComments(mainCommentsData);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };
  return (
    <div className="bg-zinc-200 h-custom7 overflow-x-auto">
      <MenuBar setToggle={setToggle} toggle={toggle} />

      <div className='mr-40'>
        <SideBar toggle={toggle} />
      </div>

      <div className='ml-8 sm:ml-20 mt-12 sm:pl-20 md:ml-22 md:mr-auto md:pl-20 lg:ml-5 lg:mr-40 flex-grow'>
        <div className="w-full flex flex-row flex-wrap justify-center bg-zinc-200 ">
          <div className="w-full h-auto flex flex-row flex-wrap justify-center bg-zinc-200">
            <div className="w-full md:w-3/4 lg:w-4/5  pb-3 pl-3 pr-3 md:px-12 lg:24 h-auto antialiased bg-zinc-200 ">
              <div className="mt-3 flex flex-col rounded-lg ">
                <div className="bg-white mt-3 pt-2 px-2 pb-2 bg-green  rounded-lg">
                  <div className="bg-white mb-2 pl-3 text-xl text-gray-700 font-semibold flex items-start"></div>
                  {post ? (   
                    <>
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="rounded-lg mt-5  h-custom3 w-full ml-2 pr-3 object-cover"
                      />
                      <div className="flex ">
                        <div className=" pt-3 pl-2 ">
                        {userLikesPost ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500 cursor-pointer" onClick={ handleLike}>
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 cursor-pointer" onClick={handleLike}>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                          )}
                        </div>
                        <div className="pt-3 pl-2 pb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 cursor-pointer" onClick={ handleComment}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                          </svg>
                        </div>
                      </div>
                      <div className=' ml-3 mr-3  flex items-start mb-1 text-zinc-500'>
                        <h1 className='text-zinc-500'>{likeCount} Likes and </h1>
                        <h1 className='ml-1 text-zinc-500'>{commentCount} Comments</h1>
                      </div>
                      {showComment && (
                        <div className="mt-4">
                          <div className="comments-container bg-zinc-200" style={{ height: '200px', overflowY: 'auto' }}>
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <div key={comment._id} className="bg-white m-2 rounded-lg shadow-md flex flex-col">
                                  <div className="flex items-start">
                                    <h3 className="text-lg font-bold mt-3 ml-2 mr-1">{comment.username}</h3>
                                    <p className="text-gray-700 ml-2 text-sm mt-4">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center mt-1 ml-2 mb-1">
                                    <p className="text-gray-500 text-xs mr-2">{comment.created_at}</p>
                                    <button className="text-indigo-500 text-xs ml-custom" onClick={() => handleReplyClick(comment._id)}>Reply</button>
                                  </div>
                                  {replyingTo === comment._id && (
                                    <div className="relative mt-2 ml-5 mb-2 mr-2">
                                      <input
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Reply to this comment"
                                        autoComplete="off"
                                        className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-3 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                                      />
                                      <div className="absolute inset-y-1 right-1 flex justify-end">
                                        <button
                                          type="submit"
                                          aria-label="Submit"
                                          className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
                                          onClick={() => handleReplySubmit(comment.username , post._id)}
                                        >
                                          <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                            <path
                                              fill="currentColor"
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                            ></path>
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {comment.repliedComments && comment.repliedComments.length > 0 && (
                                    <div className="ml-5 mt-2">
                                      {comment.repliedComments.map((reply) => (
                                        <div key={reply._id} className="bg-gray-200 m-2 rounded-lg shadow-md flex flex-col">
                                          {/* Reply content */}
                                          <div className="flex items-start">
                                            <h3 className="text-lg font-bold mt-3 ml-2 mr-1">{reply.username}</h3>
                                            <p className="text-gray-700 ml-2 text-sm mt-4">{reply.content}</p>
                                          </div>
                                          {/* Reply metadata */}
                                          <div className="flex items-center mt-1 ml-2 mb-1">
                                            <p className="text-gray-500 text-xs mr-2">{reply.created_at}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 mt-2">No comments</p>
                            )}
                          </div>

                          {/* Input for adding comments */}
                          <div className="relative mt-4 mb-4 ml-2 mr-10">
                            <input
                              onChange={handlecomments}
                              value={comment}
                              placeholder="Add your comments"
                              autoComplete="comments"
                              aria-label="comments"
                              className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                            />
                            <div className="absolute inset-y-1 right-1 flex justify-end">
                              <button
                                type="submit"
                                aria-label="Submit"
                                className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
                                onClick={handleCommentSubmit}
                              >
                                <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                  <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    
                      <div className=' ml-2  flex items-start'>
                        <div className='mr-2'>{post.username}</div>
                        {post.caption}
                      </div>
                      <div className="bg-white  ml-2 pb-1 text-gray-700 text-xs font-semibold flex items-start">
                        {post.created_at}
                      </div>
                      <div className="flex ml-2 mt-2">
                        <button onClick={handleEdit} className="flex items-center mr-2 px-3 py-1 bg-blue-500 text-white rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Edit
                        </button>
                        <button  onClick={handleDelete} className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                      <p>Loading post...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-3">Are you sure you want to delete this post?</p>
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

export default UserPostView;