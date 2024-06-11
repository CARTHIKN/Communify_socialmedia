import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import { useDispatch } from 'react-redux';

function ChangeBio() {
  const username = useSelector((state) => state.authentication_user.username);
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const navigate = useNavigate();
  const baseUrl = 'https://communify.sneaker-street.online/';

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, bio, dob };

    try {
      const res = await axios.post(baseUrl + 'api/accounts/profile/update-profile/', data);

      if (res.status === 200) {
        // Navigate to the user-profile page after successful update
        navigate('/user-profile');
        return res;
      }
    } catch (error) {
      if (error.response && error.response.status === 406) {
        console.log(error.response.data.message);
      } else {
        console.log(error.response.data);
      }
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}api/accounts/user-profile-picture/${username}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          
          
          setBio(res.data.bio || '');
          setDob(res.data.dob || '');
        }
        return res;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, [baseUrl, username]);

  return (
    <div className='mt-0'>
      <div style={{ backgroundColor: '#eee' }} className='sm:mx-32 lg:mx-32 xl:mx-72'>
        <div className='flex justify-between container mx-auto'>
          <div className='w-full'>
           
          
            <div className='px-4'>
              <form className='mx-5 my-5' onSubmit={handleSubmit}>
                <label className='relative block p-3 border-2 mt-5 border-black rounded' htmlFor='name'>
                  <span className='text-md font-semibold text-zinc-900'>Bio</span>
                  <input
                    className='w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none'
                    id='name'
                    type='text'
                    placeholder='Write Your Bio'
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </label>
                <label className='relative block p-3 border-2 mt-5 border-black rounded' htmlFor='dob'>
                  <span className='text-md font-semibold text-zinc-900'>Date of Birth</span>
                  <input
                    className='w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none'
                    id='dob'
                    type='date'
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>
                <button
                  className='mt-5 border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4'
                  type='submit'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeBio;
