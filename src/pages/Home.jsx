import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()
  const[roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuidv4()
    setRoomId(id)
    toast.success('Created a new room')
  }

  const joinRoom = () => {
    if (!roomId || !username){
        toast.error('Room Id and Username are both required')
        return;
    }
    navigate(`/editor/${roomId}`, {
        state: {
            username
        }
    })
  }

  const handleInputEnter = (e) => {
    // console.log("Event", e.code)
    if(e.code === 'Enter'){
        joinRoom()
    }
  }


  return (
    <div className='bg-[#1c1e29] h-screen flex flex-col items-center justify-center'>
        <div className=' text-[#fff] bg-[#282a36] w-[60%] p-20 rounded-2xl h-auto'>
            <div>
                <img src="./livecodex.png" className='w-48 h-48' alt="" />
                <h4 className='mb-[20px] mt-0 font-bold'>Paste Invitation Room Id</h4>
                <div className='flex flex-col space-y-3'>
                    <input onKeyUp={handleInputEnter} onChange={(e) => setRoomId(e.target.value)} value={roomId} type="text" placeholder='ROOM ID' className='bg-white p-[10px] rounded-xl outline-0 border-0 font-bold text-black' />
                    <input onKeyUp={handleInputEnter} value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='USERNAME' className='bg-white p-[10px] rounded-xl outline-0 border-0 font-bold text-black' />
                    <button onClick={joinRoom} className='cursor-pointer border border-black p-[10px] rounded-lg bg-[#4aed88] text-black font-semibold w-[100px] ml-auto hover:bg-[#2b824c]'>Join</button>
                    <span className='text-center'>If you don't have an invite then create &nbsp;<a onClick={createNewRoom} className='text-[#4aee88] underline hover:text-[#368654]' href="">new room</a></span>
                </div>
            </div>
        </div>
        <footer className='text-center text-white fixed bottom-0'>
            <h4>Built by &nbsp; <a className='text-[#4aee88] underline hover:text-[#368654]' href="https://github.com/Amanat838">Amanat Kazmi</a></h4>
        </footer>
    </div>
  )
}

export default Home