import React from 'react'
import './Navbar.scss'
import logo from '../../../assets/images/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo'>
            <img src= {logo}  alt='logo'/>
            {/* <span>Admin</span> */}
        </div>
        <div className='icons'>
            <img src = "/search.svg" alt="" className='icon'/>
            <img src = "/app.svg" alt="" className='icon'/>
            <img src = "/expand.svg" alt="" className='icon'/>
            <div className='notification'>
                <img src = "/notifications.svg" alt="" className='icon'/>
                <span>1</span>
            </div>
            <div className='user'>
                <img src = "/noavatar.png" alt="" className='icon'/>
                <span>Admin</span>
            </div>
            <img src = "setting.svg" alt="" className='icon'/>

        </div>
    </div>
    
  )
}

export default Navbar