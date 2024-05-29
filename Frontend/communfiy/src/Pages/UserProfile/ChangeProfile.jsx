import React, { useState,useEffect } from 'react';
import userimg from '../../images/user.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";



function ChangeProfile() {
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const baseUrl = "http://127.0.0.1:8000";
  const username = useSelector((state) => state.authentication_user.username);
  const handleImageChange = (event) => {
    
  const file = event.target.files[0];
  const reader = new FileReader();
  

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const preset_key = "mvdbhbcs";  
  const cloud_name = "dfu6jfpqk";
  const uploadimage = () => {
    setLoading(true);
    
  
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append("upload_preset", preset_key);
  
    axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

      .then(res =>{ if (res.data.secure_url) {
        setImageUrl(res.data.secure_url);
        setLoading(false);
      } else {
        console.log("Secure URL not available in response");
        // Handle the case where secure_url is not available
      }
        })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/accounts/user-profile-picture/${username}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setUserData(res.data)
          
        }
        return res;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, [baseUrl, username]);

  useEffect(() => {
    if (imageUrl !== null) {
      handleProfileUpdate(imageUrl);
    }
  }, [imageUrl]); 

  const handleProfileUpdate = async () => {


    const formData = {
        username:username,
        profile_picture_url: imageUrl    }

    try {
        const res = await axios.post(baseUrl + "/api/accounts/profile/picture/update/", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Ensure correct content type
              },
          
        });

        if (res.status === 200) {

          navigate("/user-profile", {
            state: res.data.message,
          });

          return res;
        }
      } catch (error) {
        if (error.response && error.response.status === 406) {
     
          console.log(error.response.data.message);
        } else {
  
          console.log("error");
        }
      }
    };
    const handleRemoveProfile = async () => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('remove', 'true');
  
      try {
        const res = await axios.post(`${baseUrl}/api/accounts/profile/picture/update/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (res.status === 200) {
          navigate("/user-profile", {
            state: res.data.message,
          });
        }
      } catch (error) {
        console.error("Error removing profile picture:", error);
      }
    };

  return (
    <div className="d-flex justify-content-center align-items-center pl-40 mr-40" >
      <section className="" style={{ backgroundColor: '#eee' }}>
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-12 col-xl-4">
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                  <div className="mt-3 mb-4  flex justify-center items-center">
                    {selectedImage ? (
                       <img
                       src={selectedImage}
                       className="rounded-full w-24 h-24 object-cover border-2 border-zinc-400 object-center "
                       style={{ width: '100px', height: '100px' }}
                       alt="img"
                     />
                    ) : (
                      <img
                        src={userData? userData.profile_picture? userData.profile_picture: userimg :userimg}
                        className="rounded-full border object-cover object-center"
                        style={{ width: '100px', height: '100px' }}
                        alt="img"
                      />
                    )}
                    
                  </div>

                  <h4 className="mb-2">{username}</h4>
                  {/* Other profile information */}
                  <div className="mt-10">
                    <form onSubmit={(e) => { e.preventDefault(); uploadimage(); }}>
                      <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        className="form-control my-2"
                        onChange={handleImageChange}
                        required
                      />

                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : (
                      <button
                        type="submit"
                        className="bg-zinc-800 px-5 py-1 rounded-full text-white shadow-lg"
                      >
                        Update Profile Pic
                      </button>
                      
                    )}  
                    {userData && userData.remove && (
                    <button
                      type="button"
                      className="bg-red-500 px-5 py-1 rounded-full text-white shadow-lg ml-3"
                      onClick={handleRemoveProfile}
                    >
                      Remove Profile
                    </button>
                  )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChangeProfile;