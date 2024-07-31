import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostReportList() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL
  const baseUrl0 =  import.meta.env.VITE_BASE_URL_0
  const baseUrl1 = import.meta.env.VITE_BASE_URL_1
  const baseUrl2 = import.meta.env.VITE_BASE_URL_2
  


  useEffect(() => {
    axios.get(`${baseUrl}/api/home/admin/list-reported-posts/`)
      .then(response => {
        setReportedPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="font-semibold text-lg text-gray-700">Reported Posts</h2>
        </div>
      </div>
      <div className="overflow-y-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">Post</th>
                <th className="px- pl-24 py-3 ">Posted by</th>
                <th className="pl-28 py-3">Report Count</th>
                <th className="pl-12 py-3">View</th>

              </tr>
            </thead>
            <tbody className="text-gray-500">
              {reportedPosts.map(post => (
                <tr key={post._id}>
                  
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {post.image_data ? (
                      <img
                        className="h-10 w-10 flex-shrink-0"
                        src={`data:image/png;base64,${post.image_data}`}
                        alt="Post"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border-b border-gray-200 pr-10 bg-white 5 py-5 text-sm">
                    <p className="whitespace-no-wrap ">{post.posted_by}</p>
                  </td>
                  <td className="border-b border-gray-200 bg-white pr-8 py-5  text-sm">
                    <p className="whitespace-no-wrap">{post.count}</p>
                  </td>
                  <td className="border-b border-gray-200 bg-white pr- py-5 mr-20 text-sm">
                  <Link to={`/admin/post-view/${post.post_id}`}>
                    <p className="whitespace-no-wrap cursor-pointer">view</p>
                </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
          <span className="text-xs text-gray-600 sm:text-sm">Showing {reportedPosts.length} Entries</span>
          <div className="mt-2 inline-flex sm:mt-0">
            <button className="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">
              Prev
            </button>
            <button className="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostReportList;
