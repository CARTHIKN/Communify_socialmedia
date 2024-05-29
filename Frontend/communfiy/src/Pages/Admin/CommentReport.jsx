import React, {useState} from 'react'
import AdminMenuBar from '../../Components/AdminNavbar/AdminMenuBar'
import AdminSideBar from '../../Components/AdminNavbar/AdminSideBar'
import CommentReportList from './CommentReportList'
// import PostReportList from './PostReportList'


function CommentReport() {
    
    const [toggle, setToggle] = useState(false)
    
  return (
    <div className='bg-zinc-200 h-100vh'>

            <AdminMenuBar setToggle={setToggle} toggle = {toggle}/>
        

        <div className='mr-40 '>
            <AdminSideBar toggle={toggle}/>
        </div>

        <div className='pt-12 mt-2 sm:mt-12 md:mt-12 md:ml-22 md:mr-20 md:pt-2 md:pl-80 lg:pt-4   '>
            <CommentReportList/>
        </div>

    </div>
  )
}

export default CommentReport
