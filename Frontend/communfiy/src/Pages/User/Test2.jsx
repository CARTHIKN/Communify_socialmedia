import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseUrl = 'https://communify.sneaker-street.online';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + '/api/post-lists/');
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (typeof res.data === 'object') {
          // Convert object to array
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
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      <div className="w-full h-screen flex flex-row flex-wrap justify-center ">
        <div className="w-full md:w-3/4 lg:w-4/5 p-5 md:px-12 lg:24 h-full antialiased">
          <div className="mt-3 flex flex-col">
            {posts.map((post, index) => (
              <div key={index} className="bg-white mt-3">
                <img className="border rounded-t-lg shadow-lg" src={post.image_url} alt={post.caption} />
                <div className="bg-white border shadow p-5 text-xl text-gray-700 font-semibold">
                  {post.caption}
                </div>
                <div className="bg-white p-1 border shadow flex flex-row flex-wrap">
                  <div className="w-1/3 hover:bg-gray-200 text-center text-xl text-gray-700 font-semibold">Like</div>
                  <div className="w-1/3 hover:bg-gray-200 border-l-4 border-r- text-center text-xl text-gray-700 font-semibold">Share</div>
                  <div className="w-1/3 hover:bg-gray-200 border-l-4 text-center text-xl text-gray-700 font-semibold">Comment</div>
                </div>

                <div className="bg-white border-4 bg-gray-300 border-white rounded-b-lg shadow p-5 text-xl text-gray-700 content-center font-semibold flex flex-row flex-wrap">
                  <div className="w-full">
                    <div className="w-full text-left text-xl text-gray-600">
                      @Some Person
                    </div>
                    {post.caption}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostView;
