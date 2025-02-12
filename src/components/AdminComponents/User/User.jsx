import React from 'react'
import './User.scss'
import Single from '../Single/Single'
import { singleUser } from '../Data/singleUser'

const User = () => {
  return (
    <div className='user'>
      <Single {...singleUser}/>
    </div>
  )
}

export default User