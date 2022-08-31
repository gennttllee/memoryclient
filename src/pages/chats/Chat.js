import { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux'
import { fetchChats, myChats, createChat } from '../../features/chats/chatSlice';
import { user, users, getStatus, error, fetchUsers } from '../../features/users/userSlice'
import './chat.css'

const Chat = () => {
  const [show, setShow] = useState(true)
  const dispatch = useDispatch();
  const url = "http://localhost:5000"
  const userInfo = useSelector(user);
  const people = useSelector(users)
  const status = useSelector(getStatus)
  const err = useSelector(error)
  const message = useSelector(myChats);

  useEffect(() => {
    dispatch(fetchUsers(userInfo.email))
    dispatch(fetchChats(userInfo.email))
  }, [userInfo, dispatch]);

  useEffect(() => {
    const socket = io(url);
    socket.emit('login', (userInfo.email))

    return () => {
      socket.emit('logout', (userInfo.email))
    }
  }, [userInfo]);

  if (status === 'loading') {
    return <h1>loading</h1>
  }

  if (status === 'failed') {
    return <h1>sorry something went wrong pease try again later</h1>
  }

  if (status === 'success') {
    const create = (user) => {
      dispatch(createChat({
        email: userInfo.email,
        data: user.email
      }))
    }
    return (
      <section className='section'>
        <div className='divContact'>
          <div className='contact'>
            <h1>Chats</h1>
            <button onClick={() => setShow(!show)} className='contactBtn'>
              <span className="fa fa-plus"></span>
            </button>
          </div>
          {show ? message.map((user, index) => <div className='user' key={index}>
            <img className='img' referrerPolicy="no-referrer" src={user.picture} alt='pics' />
            <p>{user.name}</p>
            <span className={`fa fa-circle ${user.status === 'online' && 'greens'}`}></span>
          </div>) : people.map((user, index) => <div onClick={() => create(user)} className='user' key={index}>
            <img className='img' referrerPolicy="no-referrer" src={user.picture} alt='pics' />
            <p>{user.name}</p>
            <span className={`fa fa-circle ${user.status === 'online' && 'greens'}`}></span>
          </div>)}
        </div>
        <div className='chat'>
          <div className='send'>
            <input className='inputMessage' type='text' placeholder='send a message' name="message" />
            <button className='plane'>
              <span className="fa fa-paper-plane"></span>
            </button>
          </div>
        </div>
      </section>
    )
  }
}

export default Chat