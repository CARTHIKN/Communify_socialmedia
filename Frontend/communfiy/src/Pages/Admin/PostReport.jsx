import React, {useState} from 'react'
import AdminMenuBar from '../../Components/AdminNavbar/AdminMenuBar'
import AdminSideBar from '../../Components/AdminNavbar/AdminSideBar'
import PostReportList from './PostReportList'


function PostReport() {
    
    const [toggle, setToggle] = useState(false)
    
  return (
    <div className='bg-zinc-200 h-100vh'>

            <AdminMenuBar setToggle={setToggle} toggle = {toggle}/>
        

        <div className='mr-40 '>
            <AdminSideBar toggle={toggle}/>
        </div>

        <div className='pt-12 mt-2 sm:mt-12 md:mt-10 md:ml-22 md:mr-auto md:pt-2 md:pl-60 lg:pt-4   '>
            <PostReportList/>
        </div>

    </div>
  )
}

export default PostReport
