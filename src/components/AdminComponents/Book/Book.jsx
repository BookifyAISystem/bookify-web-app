import React from 'react'
import './Book.scss'
import Single from '../Single/Single'
import { singleBook } from '../Data/singleBook'

const Book = () => {
  return (
    <div className='book'>
      <Single {...singleBook}/>
    </div>
  )
}

export default Book