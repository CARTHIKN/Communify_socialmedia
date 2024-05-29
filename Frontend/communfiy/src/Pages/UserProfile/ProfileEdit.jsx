import React from 'react'
import ChangeProfile from './ChangeProfile'
import ChangeBio from './ChangeBio'

function ProfileEdit() {
  return (
    <div className='h-full'style={{ height: '100vh', backgroundColor: '#eee' }}>
        <div Name=  'lg:pl-40 g:pr-40  w-full'  >
        <ChangeProfile/>
            
        </div>
        
        <div className=  'lg:pl-40  lg:pr-40 w-full '>
        <ChangeBio/>
        </div>
      

            
    </div>
  )
}

export default ProfileEdit
