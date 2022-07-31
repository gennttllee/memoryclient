import Layout from "../components/Layout"
import { selectAllPosts } from '../features/posts/postSlice';
import { useSelector, useDispatch } from "react-redux"
import { user, logout } from '../features/users/userSlice';
import Post from "../components/posts/post/Post";
import {  useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './profile.css';

const Profile = () => {
    const userInfo = useSelector(user);
    const posts = useSelector(selectAllPosts)
    const profilePost = posts.filter(item => item.email === userInfo.email)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate('/')
        }
    }, [userInfo, navigate]);

    const dispatch = useDispatch()

    const signOut = (e) => {
        e.preventDefault();
        dispatch(logout())
        navigate('/')
    }
    return (
        userInfo && <Layout>
            <div className="profile">
                <img className="profilePic" src={userInfo.picture} alt='profile' />
                <p>{userInfo.name}</p>
                <p>{userInfo.email}</p>
                <button className="logout" onClick={signOut}>Logout</button>
                {profilePost.length > 0 ? <div className="profileContainer">
                    {profilePost.map((item, index) => <Post
                        key={index}
                        post={item}
                    />)}
                </div> : <p>No post yet</p>}
            </div>
        </Layout>
    )
}

export default Profile