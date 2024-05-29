import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userimg from "../../images/user.png";
import { useSelector } from 'react-redux';

function PostView({ refreshPosts }) {
 const username = useSelector((state) => state.authentication_user.username);
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [comment, setComment] = useState('')
 const [comments,setComments] = useState('')
 const [likedPostIds, setLikedPostIds] = useState()
 const [profileImages, setProfileImages] = useState({}); 
 const [showCommentInput, setShowCommentInput] = useState(null);
 const navigate = useNavigate();
 const baseUrl = 'http://127.0.0.1:8001';
 const token = localStorage.getItem("access");
 const [replyToCommentId, setReplyToCommentId] = useState(null); 
 const [replyContent, setReplyContent] = useState(''); 
 const [savedPostIds, setSavedPostIds] = useState([])
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [reportType, setReportType] = useState(null);
 const [reportPostId, setReportPostId] = useState(null)
 const [reportCommentId, setReportCommentId] = useState(null)
 const [successMessage, setSuccessMessage] = useState('');





 useEffect(() => {
  const fetchLikedPosts = async () => {
    try {
      const response = await axios.post(baseUrl + '/api/home/user/post/fetch-like/', 
        {
          username: username, 
        }
      );

      setLikedPostIds(response.data);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  fetchLikedPosts();
 
}, []); 
useEffect(() => {
  
  const fetchSavedPosts = async () => {
    try {
      const response = await axios.post(baseUrl +'/api/home/user/fetch-saved-post/', { username:username });
      const { saved_posts } = response.data;
      setSavedPostIds(saved_posts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    }
  };
  fetchSavedPosts()
}, []); 

useEffect(() => {
  const fetchLikeAndCommentCounts = async () => {
    const updatedPosts = [];
    for (const post of posts) {
      try {
        const response = await axios.get(`${baseUrl}/api/home/user/like-comments-count/?post_id=${post.id}`);
        const { likes_count, comments_count } = response.data;
        const updatedPost = { ...post, likes_count, comments_count };
        updatedPosts.push(updatedPost);
      } catch (error) {
        console.error('Error fetching like and comment counts:', error);
        // Push the post as is if there's an error fetching counts
        updatedPosts.push(post);
      }
    }
    setPosts(updatedPosts);
  };

  if (posts.length > 0) {
    fetchLikeAndCommentCounts();
  }
}, [likedPostIds,comment,comments,loading]);


const handleReplySubmit = async (parentCommentId, parendUsername) => {
  try {
    const response = await axios.post(baseUrl + '/api/home/user/comment/reply/', {
      username: username,
      parendUsername: parendUsername, // Corrected spelling of parentUsername
      parent_comment_id: parentCommentId,
      content: replyContent,
    });
    
    // const newComment = response.data;

    // Fetch the replied messages associated with the parent comment
    const repliedCommentsResponse = await axios.get(`${baseUrl}/api/home/user/comment/replied-comments/?parent_comment_id=${parentCommentId}`);
    const repliedComments = repliedCommentsResponse.data.replied_comments;

    // Update the comments state by adding the new comment and its replied comments
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment._id === parentCommentId) {
          return { ...comment, repliedComments };
        }
        return comment;
      });
      return [...updatedComments];
    });

    setReplyToCommentId(null); // Clear the reply target after submitting
    setReplyContent('');
  } catch (error) {
    console.error('Error submitting reply:', error);
  }
};

const handleReplyClick = async (commentId) => {

  setReplyToCommentId(commentId);
  setReplyContent('');
  
};

 useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + '/api/home/post-lists/',{headers: {
          Authorization: `Bearer ${token}`, // Note the space after Bearer
          Accept: "application/json",
          "Content-Type": "multipart/form-data" // Corrected typo in "application/json"
          }});
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (typeof res.data === 'object') {
          setPosts(res.data.posts);
        } else {
          console.log("Unexpected data format:", res.data);
        }
        setLoading(false);
        if (res.status === 200) {
          navigate('/home');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
 }, [refreshPosts]);




 useEffect(() => {
    const fetchProfileImages = async () => {
      const images = {};
      for (const post of posts) {
        const imageUrl = await fetchUserProfile(post.username);
        images[post.username] = imageUrl || userimg; // Default to userimg if not available
      }
      setProfileImages(images); // Update the state with fetched images
    };

    if (posts.length > 0) {
      fetchProfileImages();
    }
 }, [posts]); // Depend on posts to re-fetch when posts change

 const fetchUserProfile = async (username) => {
    try {
      const userProfileResponse = await axios.get(`http://127.0.0.1:8000/api/accounts/user-profile-picture/${username}`);
      return userProfileResponse.data.profile_picture;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
 };

 const handlecomments = (event) => {
  // Log the value being set instead of the entire state
  setComment(event.target.value);
};
 

 const handleLike = async (postId) => {
  try {
    console.log("---------------------------");
      const res = await axios.post(baseUrl + '/api/home/user/post/like/', { postId, username },);
      if (res.status === 200 || res.status === 201) {
         if (likedPostIds.includes(postId)) {

          setLikedPostIds(prevState => prevState.filter(id => id !== postId));
        } else {

          setLikedPostIds(prevState => [...prevState, postId]);
        }
      }
  } catch (error) {
      console.error('Error liking/unliking post:', error);
  }
};

 const handleUsernameClick = (others_username) => {
    if (others_username === username) {
      navigate('/user-profile');
    } else {
      navigate(`/friend-profile/${others_username}`);
    }
 };

 const handlecommentsubmit = async (post_id) => {
  console.log(comments, "--------------------");
  try {
    if (comment.trim() === '') {
      // If comment is empty or contains only whitespace, do nothing
      return;
    }

    const response = await axios.post(baseUrl + '/api/home/user/comment/', {
      username: username,
      post_id: post_id,
      content: comment,
    });
    // Assuming response.data is the newly added comment object
    const res = await axios.get(baseUrl + `/api/home/user/comment/${post_id}`);

    // Assuming response.data is a JSON string, parse it into an array
    const parentComments = JSON.parse(res.data);
    const requests = parentComments.map(async (comment) => {
      const repliedCommentsResponse = await axios.get(`${baseUrl}/api/home/user/comment/replied-comments/?parent_comment_id=${comment._id}`);
      const repliedComments = repliedCommentsResponse.data.replied_comments;
      return { ...comment, repliedComments };
    });

    const allCommentsWithReplies = await Promise.all(requests);

    // Update state with both parent comments and their replied comments
    setComments(allCommentsWithReplies);
    setComment('');
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
};

 if (loading) {
    return <div className='mt-48'>
              <div class="w-full gap-x-2 flex justify-center items-center">
                <div
                  class="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
                ></div>
                <div
                  class="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
                ></div>
                <div
                  class="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
                ></div>
                </div>

          </div>;
 }


const handleCommentIconClick = async (post_id) => {
  try {
    // Fetch parent comments
    const parentCommentsResponse = await axios.get(baseUrl + `/api/home/user/comment/${post_id}`);
    const parentComments = JSON.parse(parentCommentsResponse.data);

    // Fetch replied comments for each parent comment
    const requests = parentComments.map(async (comment) => {
      const repliedCommentsResponse = await axios.get(`${baseUrl}/api/home/user/comment/replied-comments/?parent_comment_id=${comment._id}`);
      const repliedComments = repliedCommentsResponse.data.replied_comments;
      return { ...comment, repliedComments };
    });

    const allCommentsWithReplies = await Promise.all(requests);

    // Update state with both parent comments and their replied comments
    setComments(allCommentsWithReplies);
    setShowCommentInput((prev) => (prev === post_id ? null : post_id));
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const handleSaveClick = async  (post_id) => {
  try {
    
      const res = await axios.post(baseUrl + '/api/home/user/save-post/', { postId : post_id, username:username },);
      if (res.status === 200 || res.status === 201) {
        if (savedPostIds.includes(post_id)) {

         setSavedPostIds(prevState => prevState.filter(id => id !== post_id));
       } else {

         setSavedPostIds(prevState => [...prevState, post_id]);
       }
     }
  } catch (error) {
      console.error('Error save/unsave post:', error);
  }

}
const handlePostReport = async (postid) => {
  setReportType("post")
  setReportPostId(postid)
  setShowConfirmation(true); 
};
const handleCommentReport = async (commentid) => {
  setReportType("comment")
  setReportCommentId(commentid)
  setShowConfirmation(true); 
};

const confirmReport = async () => {
if (reportType ==='post'){
  try {
    await axios.post('http://127.0.0.1:8001/api/home/user/post-report/' ,{ post_id : reportPostId, reported_by:username},);
    setShowConfirmation(false);
    setReportPostId(null)
    setSuccessMessage('Post reported successfully.');
    setTimeout(() => {
      setSuccessMessage('');
    }, 1000);
  } catch (error) {
    console.error('Error Reporting post:', error);
  }
} else if (reportType ==='comment') {
  try {
    await axios.post('http://127.0.0.1:8001/api/home/user/comment-report/' ,{ comment_id : reportCommentId, reported_by:username},);
    setShowConfirmation(false);
    setReportCommentId(null)
    setSuccessMessage('Comment reported successfully.');
    setTimeout(() => {
      setSuccessMessage('');
    }, 1000);
  } catch (error) {
    console.error('Error Reporting Comment:', error);
  }
}
};

const cancelReport = () => {
  setShowConfirmation(false); // Hide confirmation modal if user cancels deletion
};
 return (
    <div className="w-full flex flex-row flex-wrap justify-center bg-zinc-200 ">
      <div className="w-full h-auto flex flex-row flex-wrap justify-center bg-zinc-200">
        <div className="w-full md:w-3/4 lg:w-4/5  pb-3 pl-3 pr-3 md:px-12 lg:24 h-auto antialiased bg-zinc-200 ">
          <div className="mt-3 flex flex-col rounded-lg ">
            {posts.map((post, index) => (
              <div key={index} className="bg-white mt-3 pt-2 px-2 pb-2 bg-green rounded-lg">
                <div className="bg-white mb-2 pl-3 text-xl text-gray-700 font-semibold flex items-start">
                 <img
                    className="w-7 h-7 mt- rounded-full object-cover object-center"
                    src={profileImages[post.username] || userimg} // Use the state for the src
                    alt="user photo"
                 />
                 <div className='pl-2 mt-' onClick={() => handleUsernameClick(post.username)}>
                    <a href="#" className="text-zinc-500 text-lg">{post.username}</a>
                 </div>
                 <div className='flex justify-end w-full'>
                    <div class="relative inline-block group">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                      </svg>
                      <div class="absolute right-0 hover:bg-gray-100 w-22 bg-zinc-200 border border-gray-300 rounded-lg shadow-lg hidden group-hover:block">
                        <ul class="p-2">
                          <li class="hover:bg-gray-100 text-xs cursor-pointer" onClick={() => handlePostReport(post.id)}>Report</li>

                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
                {post.image_url && (
                 <img
                    src={`data:image/jpeg;base64,${post.image_url}`} 
                    alt={post.caption}
                    className="w-full rounded-lg"
                 />
                )}
                
                <div className="flex ">
                  <div className=" pt-3 pl-2 ">
                  {likedPostIds.includes(post.id) ? (
                    

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-red-500 cursor-pointer" onClick={() => handleLike(post.id)}>
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />

                    </svg>

                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-8 h-8 cursor-pointer"
                      onClick={() => handleLike(post.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  )}


     
                  </div>
                 

                  
                  <div className="pt-3 ml-2 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 cursor-pointer" onClick={() => handleCommentIconClick(post.id)}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                  </div>
                  <div className="pt-3 ml-custom1 pb-2 text-right">
                  {savedPostIds.includes(post.id) ? (
                
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-7 cursor-pointer" onClick={() => handleSaveClick(post.id)}>
                  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                </svg>
                
                  ):(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-7 text-right cursor-pointer" onClick={() => handleSaveClick(post.id)}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  
                  )}

                  </div>
                  



                </div>
                
                
                <div className=' ml-3 mr-3  flex items-start mb-1 text-zinc-500'>
                <h1 className='text-zinc-500'>{post.likes_count} Likes and </h1>
                <h1 className='ml-1 text-zinc-500'>{post.comments_count} Comments</h1>
                </div>

                <div className=' ml-3 mr-3  flex items-start'>
                 {/* <div className='mr-2'> {post.username}</div> */}
                 {post.caption}  
                </div>
                {showCommentInput === post.id &&  (
                  <div>
                    <div class="bg-gray-100 p-2 rounded ">
                    <h2 class="text-lg font-bold mb-2">Comments</h2>
                    <div class="comments-container "  style={{ height: '200px', overflowY: 'auto' }}>
                    {Array.isArray(comments) && comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="bg-white m-2 rounded-lg shadow-md flex flex-col">
                          <div className="flex items-start">
                            <h3 className="text-lg font-bold mt-3 ml-2 mr-1">{comment.username}</h3>
                            <p className="text-gray-700 ml-2 text-sm mt-4">{comment.content}</p>
                          </div>
                          <div className="flex items-center mt-1 ml-2 mb-1">
                            <p className="text-gray-500 text-xs mr-2"> {comment.created_at}</p>
                            <button className="text-indigo-500 text-xs ml-custom" onClick={() => handleReplyClick(comment._id)}>Reply</button>
                            <button className="text-zinc-500 text-xs ml-4" onClick={() => handleCommentReport(comment._id)}>Report</button>
                          </div>
                          {replyToCommentId === comment._id && (
                            <div className="relative mt-4 mb-4 ml-2 mr-10">
                              <input
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Add your comments"
                                value={replyContent}
                                autoComplete="comments" // Corrected attribute name
                                aria-label="comments"
                                className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                              />
                              <div className="absolute inset-y-1 right-1 flex justify-end">
                                <button
                                  onClick={() => handleReplySubmit(comment._id, comment.username)}
                                  type="submit"
                                  aria-label="Submit"
                                  className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
                                >
                                  <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd" // Corrected attribute name
                                      clipRule="evenodd" // Corrected attribute name
                                      d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Display replied comments */}
                          {Array.isArray(comment.repliedComments) && comment.repliedComments.length > 0 && (
                            <div className="ml-8 ">
                             
                              {comment.repliedComments.map((reply) => (
                                <div key={reply._id} className="flex flex-col mt-2">
                                 <div className="flex items-start ml-5 mb-2">
                                <h3 className="text-lg font-bold mt-0 ml-0 mr-1">{reply.username}</h3>
                                <p className="mt-1 ml-2">{reply.content}</p>
                                <p className="text-xs text-gray-500 mt-2 ml-5"> {reply.created_at}</p>
                                {/* <button className="text-indigo-500 text-xs ml-2 mt-1" onClick={() => handleReplyClick(reply._id)}>Reply</button> */}
                              </div>

                                  {/* Conditionally render the input field for replying to this specific comment */}
                                  {replyToCommentId === reply._id && (
                                    <div className="relative mt-4 ml-6 mb-2 mr-3 ">
                                      <input
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Add your comments"
                                        value={replyContent}
                                        autoComplete="comments"
                                        aria-label="comments"
                                        className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                                      />
                                      <div className="absolute inset-y-1 right-1 flex justify-end">
                                        <button
                                          onClick={() => handleReplySubmit(reply._id, reply.username)}
                                          type="submit"
                                          aria-label="Submit"
                                          className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
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
                                </div>
                              ))}
                            </div>
                          )}


                        </div>
                      ))
                    ) : (
                      <p>No comments to display.</p>
                    )}
                        
                    </div>
                </div>
                  
                <div class="relative mt-4 mb-4 ml-2 mr-10">
                  
                  <input
                    onChange={handlecomments}
                    placeholder="Add your comments"
                    value={comment}
                    autocomplete="comments"
                    aria-label="comments"
                    class="block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                  />
                  <div class="absolute inset-y-1 right-1 flex justify-end">
                    <button
                      onClick={()=>handlecommentsubmit(post.id)}
                      type="submit"
                      aria-label="Submit"
                      class="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
                    >
                      <svg viewBox="0 0 16 6" aria-hidden="true" class="w-4">
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                </div>
                )}
                <div className="bg-white ml-3  text-gray-400 text-xs font-semibold flex items-start">
                {post.created_at}
                </div>
              </div>
              
            ))}
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-3">Are you sure you want to report this {reportType}?</p>
            <div className="flex justify-center">
              <button onClick={confirmReport} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-3">Yes</button>
              <button onClick={cancelReport} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}
                  {successMessage && <div  className="fixed inset-0 flex ml-40 text-md justify-center text-white items-center bg-black bg-opacity-50">{successMessage}</div>}

    </div>
 );
}

export default PostView;
