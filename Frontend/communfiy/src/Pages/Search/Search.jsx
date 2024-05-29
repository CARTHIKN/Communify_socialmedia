import React, { useState } from 'react';
import MenuBar from '../../Components/NavBar/MenuBar'
import SideBar from '../../Components/NavBar/Sidebar'
import SearchTab from './SearchTab';



function Search() {
    const [toggle, setToggle] = useState(false)
  return (
    <div className="bg-zinc-200 h-screen  " >
            <MenuBar setToggle={setToggle} toggle = {toggle}/>
        

        <div className='mr-40 '>
            <SideBar toggle={toggle}/>
        </div>
       
       
        <div className='pt-12 mt-2 h-auto bg-zinc-200 sm:mt-12 sm:ml-20 sm:pl-20 md:mt-10 md:ml-22 md:mr-auto md:pt-2 md:pl-20 lg:pt-10 lg:ml-60  lg:mr-20 '>
            <SearchTab/>
        </div>
        
        

       
        
        
        
        
      
    </div>
  )
}

export default Search
