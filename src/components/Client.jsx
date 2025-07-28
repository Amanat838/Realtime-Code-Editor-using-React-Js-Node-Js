import React, { use } from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <Avatar name={username} size={50} round="14px"/>
        <span className='font-bold'>{username}</span>
    </div>
  )
}

export default Client